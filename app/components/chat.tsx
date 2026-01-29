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
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
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

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

const EmptyState = ({ onExampleClick }: { onExampleClick: (query: string) => void }) => {
  const examples = [
    "What was the key holding in Brown v. Board of Education?",
    "Explain the dissenting opinion in Roe v. Wade",
    "What precedents did Citizens United overturn?"
  ];

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <h2 className={styles.emptyStateTitle}>
          Supreme Court Research
        </h2>
        <p className={styles.emptyStateSubtitle}>
          Ask questions about any Supreme Court case to get instant insights on holdings, dissents, and precedents.
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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    setIsThinking(true);

    await sendMessage(userInput);
    scrollToBottom();
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
      <div className={styles.messages}>
        {messages.length === 0 && <EmptyState onExampleClick={handleExampleClick} />}
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
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
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about any Supreme Court case..."
          disabled={inputDisabled}
        />
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
