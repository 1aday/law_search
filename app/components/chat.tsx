"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import remarkGfm from 'remark-gfm';

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
  id?: number;
  bookmarked?: boolean;
  onBookmark?: (id: number) => void;
  onExtractCitations?: (text: string) => void;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text, id, bookmarked, onBookmark, onExtractCitations }: {
  text: string;
  id?: number;
  bookmarked?: boolean;
  onBookmark?: (id: number) => void;
  onExtractCitations?: (text: string) => void;
}) => {
  const [copied, setCopied] = React.useState(false);
  const [citationsCopied, setCitationsCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExtractCitations = () => {
    // Extract case citations from text (simple pattern matching)
    const citationPattern = /\[?\d{4}\]\s*\d*\s*S\.?C\.?R\.?\s*\d+|R\.\s*v\.\s*[A-Z][a-zA-Z]+|Reference\s+re\s+[A-Z][a-zA-Z\s]+/g;
    const citations = text.match(citationPattern) || [];
    const uniqueCitations = [...new Set(citations)];
    const citationText = uniqueCitations.join('\n');

    if (citationText) {
      navigator.clipboard.writeText(citationText);
      setCitationsCopied(true);
      setTimeout(() => setCitationsCopied(false), 2000);
      if (onExtractCitations) {
        onExtractCitations(citationText);
      }
    }
  };

  return (
    <div className={styles.assistantMessage}>
      <div className={styles.messageActions}>
        <button
          className={styles.actionButton}
          onClick={handleCopy}
          title="Copy full response"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <button
          className={styles.actionButton}
          onClick={handleExtractCitations}
          title="Extract case citations"
        >
          {citationsCopied ? '✓ Citations' : 'Citations'}
        </button>
        {id !== undefined && onBookmark && (
          <button
            className={`${styles.actionButton} ${bookmarked ? styles.bookmarked : ''}`}
            onClick={() => onBookmark(id)}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark response'}
          >
            {bookmarked ? '★ Saved' : '☆ Save'}
          </button>
        )}
      </div>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          td: ({ children }) => {
            const content = children?.toString() || '';
            if (content.includes('<span>')) {
              const areas = content.match(/<span>(.*?)<\/span>/g)
                ?.map(span =>
                  span.replace(/<\/?span>/g, '')
                    .replace(/^[,\s]+|[,\s]+$/g, '')
                    .trim()
                )
                .filter(area => area.length > 0);

              return (
                <td>
                  <div className={styles.legalTags}>
                    {areas?.map((area, index) => (
                      <span key={index} className={styles.legalTag}>
                        {area}
                      </span>
                    ))}
                  </div>
                </td>
              );
            }
            return <td>{children}</td>;
          }
        }}
      >
        {text}
      </Markdown>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.codeMessage}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}.`}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const Message = ({ role, text, id, bookmarked, onBookmark, onExtractCitations }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return (
        <AssistantMessage
          text={text}
          id={id}
          bookmarked={bookmarked}
          onBookmark={onBookmark}
          onExtractCitations={onExtractCitations}
        />
      );
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

const EmptyState = ({ onExampleClick }: { onExampleClick: (query: string) => void }) => {
  const examples = [
    "What is the Oakes test and how is it applied in Charter analysis?",
    "Explain the ratio decidendi in R. v. Morgentaler regarding section 7 rights",
    "What did the SCC hold in Reference re Secession of Quebec?",
    "How did Roncarelli v. Duplessis establish the rule of law in Canada?"
  ];

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <h2 className={styles.emptyStateTitle}>
          Supreme Court of Canada Research
        </h2>
        <p className={styles.emptyStateSubtitle}>
          Ask questions about any SCC decision to get instant analysis of holdings, dissents, Charter applications, and precedential value.
        </p>
        <div className={styles.exampleQueries}>
          {examples.map((query, index) => (
            <div
              key={index}
              className={styles.exampleQuery}
              onClick={() => onExampleClick(query)}
            >
              {query}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""),
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<Set<number>>(new Set());
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [savedSessions, setSavedSessions] = useState<string[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [extractedCitations, setExtractedCitations] = useState<string>('');
  const [showCitations, setShowCitations] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (force = false) => {
    if (!isUserScrolling || force) {
      messagesEndRef.current?.scrollIntoView({ behavior: force ? "auto" : "smooth" });
    }
  };

  const checkIfAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom < threshold;
  };

  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up
    if (!isUserScrolling) {
      scrollToBottom();
    } else {
      // Show scroll button if not at bottom
      setShowScrollButton(!checkIfAtBottom());
    }
  }, [messages, isUserScrolling]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);

      // Check if user has scrolled away from bottom
      setIsUserScrolling(!checkIfAtBottom());

      // Reset scroll flag after 3 seconds of no scrolling
      scrollTimeout = setTimeout(() => {
        if (checkIfAtBottom()) {
          setIsUserScrolling(false);
          setShowScrollButton(false);
        }
      }, 3000);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    // Load data from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    }

    const savedBookmarks = localStorage.getItem('bookmarkedMessages');
    if (savedBookmarks) {
      try {
        setBookmarkedMessages(new Set(JSON.parse(savedBookmarks)));
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    }

    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    setSavedSessions(sessions.map(s => s.name));

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to hide overlays
      if (e.key === 'Escape') {
        setShowHistory(false);
        setShowBookmarks(false);
        setShowSessions(false);
        setShowCitations(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const createThread = async () => {
      try {
        const res = await fetch('/api/assistants/threads', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error(`Thread creation failed: ${await res.text()}`);
        }

        const data = await res.json();
        setThreadId(data.threadId);
      } catch (error) {
        console.error('Failed to create thread:', error);
      }
    };
    createThread();
  }, []);

  const sendMessage = async (text) => {
    if (!threadId) {
      console.error('No thread ID available');
      return;
    }

    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const query = userInput.trim();

    // Add to search history
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: query },
    ]);
    setUserInput("");
    setInputDisabled(true);
    setIsThinking(true);
    setShowHistory(false);

    await sendMessage(query);
    scrollToBottom();
  };

  const handleClearConversation = () => {
    if (confirm('Clear entire conversation? This cannot be undone.')) {
      setMessages([]);
      // Create new thread
      fetch('/api/assistants/threads', {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      .then(res => res.json())
      .then(data => setThreadId(data.threadId))
      .catch(console.error);
    }
  };

  const handleExportConversation = () => {
    const exportText = messages.map(msg => {
      const role = msg.role === 'user' ? 'Q' : 'A';
      return `${role}: ${msg.text}\n\n`;
    }).join('---\n\n');

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scc-research-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBookmark = (messageId: number) => {
    setBookmarkedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      localStorage.setItem('bookmarkedMessages', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const handleSaveSession = () => {
    const name = sessionName.trim() || `Session ${new Date().toLocaleString()}`;
    const session = {
      name,
      messages,
      bookmarked: [...bookmarkedMessages],
      timestamp: new Date().toISOString()
    };

    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    sessions.unshift(session);
    localStorage.setItem('sessions', JSON.stringify(sessions.slice(0, 20)));
    setSavedSessions(sessions.slice(0, 20).map(s => s.name));
    setSessionName('');
    alert(`Session "${name}" saved`);
  };

  const handleLoadSession = (sessionName: string) => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const session = sessions.find(s => s.name === sessionName);
    if (session) {
      setMessages(session.messages);
      setBookmarkedMessages(new Set(session.bookmarked || []));
      setShowSessions(false);
    }
  };

  const handleExtractCitations = (citations: string) => {
    setExtractedCitations(prev => prev ? `${prev}\n${citations}` : citations);
    setShowCitations(true);
  };

  const handleExampleClick = (query: string) => {
    setUserInput(query);
    // Automatically submit
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", text: query },
      ]);
      setUserInput("");
      setInputDisabled(true);
      setIsThinking(true);
      sendMessage(query);
    }, 100);
  };

  const handleTextCreated = () => {
    setIsThinking(false);
    appendMessage("assistant", "");
  };

  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  const toolCallCreated = (toolCall) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  const toolCallDelta = (delta, snapshot) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation) => {
        if (annotation.type === 'file_path') {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  return (
    <div className={styles.chatContainer}>
      {messages.length > 0 && (
        <div className={styles.toolbar}>
          <button
            className={styles.toolbarButton}
            onClick={() => setShowBookmarks(!showBookmarks)}
            title="View saved responses"
          >
            ★ Saved ({bookmarkedMessages.size})
          </button>
          <button
            className={styles.toolbarButton}
            onClick={() => setShowSessions(!showSessions)}
            title="Save/load research sessions"
          >
            Sessions
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleExportConversation}
            title="Export conversation to text file"
          >
            Export
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleClearConversation}
            title="Clear conversation"
          >
            Clear
          </button>
          <div className={styles.toolbarInfo}>
            {messages.filter(m => m.role === 'user').length} queries
          </div>
        </div>
      )}
      <div className={styles.messages} ref={messagesContainerRef}>
        {messages.length === 0 && <EmptyState onExampleClick={handleExampleClick} />}
        {messages.map((msg, index) => (
          <Message
            key={index}
            role={msg.role}
            text={msg.text}
            id={index}
            bookmarked={bookmarkedMessages.has(index)}
            onBookmark={handleBookmark}
            onExtractCitations={handleExtractCitations}
          />
        ))}
        {isThinking && (
          <div className={styles.thinkingContainer}>
            <div className={styles.thinkingBubble}>
              <span className={styles.thinkingText}>Thinking</span>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          className={styles.scrollToBottomButton}
          onClick={() => {
            scrollToBottom(true);
            setIsUserScrolling(false);
            setShowScrollButton(false);
          }}
        >
          ↓ New messages
        </button>
      )}

      {/* Bookmarks Sidebar */}
      {showBookmarks && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Saved Responses</h3>
            <button
              className={styles.closeButton}
              onClick={() => setShowBookmarks(false)}
            >
              ×
            </button>
          </div>
          <div className={styles.sidebarContent}>
            {bookmarkedMessages.size === 0 ? (
              <p className={styles.emptyText}>No saved responses yet. Click the ☆ Save button on any response.</p>
            ) : (
              [...bookmarkedMessages].map(msgId => {
                const msg = messages[msgId];
                if (!msg || msg.role !== 'assistant') return null;
                return (
                  <div key={msgId} className={styles.bookmarkItem}>
                    <div className={styles.bookmarkText}>
                      {msg.text.substring(0, 200)}...
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleBookmark(msgId)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Sessions Sidebar */}
      {showSessions && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Research Sessions</h3>
            <button
              className={styles.closeButton}
              onClick={() => setShowSessions(false)}
            >
              ×
            </button>
          </div>
          <div className={styles.sidebarContent}>
            <div className={styles.saveSession}>
              <input
                type="text"
                placeholder="Session name (optional)"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className={styles.sessionInput}
              />
              <button
                className={styles.saveButton}
                onClick={handleSaveSession}
              >
                Save Current Session
              </button>
            </div>
            <div className={styles.sessionList}>
              <h4>Saved Sessions</h4>
              {savedSessions.length === 0 ? (
                <p className={styles.emptyText}>No saved sessions yet.</p>
              ) : (
                savedSessions.map((name, index) => (
                  <div key={index} className={styles.sessionItem}>
                    <button
                      onClick={() => handleLoadSession(name)}
                      className={styles.sessionName}
                    >
                      {name}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Citations Panel */}
      {showCitations && extractedCitations && (
        <div className={styles.citationsPanel}>
          <div className={styles.citationsHeader}>
            <h3>Extracted Citations</h3>
            <button
              className={styles.closeButton}
              onClick={() => setShowCitations(false)}
            >
              ×
            </button>
          </div>
          <pre className={styles.citationsContent}>{extractedCitations}</pre>
          <button
            className={styles.copyCitationsButton}
            onClick={() => {
              navigator.clipboard.writeText(extractedCitations);
              alert('Citations copied!');
            }}
          >
            Copy All Citations
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
            placeholder="Ask about any Supreme Court of Canada decision..."
            disabled={inputDisabled}
          />
          {showHistory && searchHistory.length > 0 && (
            <div className={styles.historyDropdown}>
              <div className={styles.historyHeader}>Recent searches</div>
              {searchHistory.map((query, index) => (
                <div
                  key={index}
                  className={styles.historyItem}
                  onClick={() => {
                    setUserInput(query);
                    setShowHistory(false);
                    inputRef.current?.focus();
                  }}
                >
                  {query}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled || !userInput.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
