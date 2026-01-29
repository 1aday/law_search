"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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

            // Check if content contains <span> tags
            if (content.includes('<span>')) {
              // Extract text between span tags and clean up
              const areas = content.match(/<span>(.*?)<\/span>/g)
                ?.map(span =>
                  span.replace(/<\/?span>/g, '')  // Remove span tags
                    .replace(/^[,\s]+|[,\s]+$/g, '') // Remove leading/trailing commas and whitespace
                    .trim()
                )
                .filter(area => area.length > 0); // Remove empty strings

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

const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <h2 className={styles.emptyStateTitle}>
          Interrogate the Law
        </h2>
        <p className={styles.emptyStateSubtitle}>
          Ask anything about Supreme Court cases. Uncover holdings, dissents, and precedents with precision.
        </p>
        <div className={styles.exampleQueries}>
          <div className={styles.exampleQuery}>
            What was the key holding in Brown v. Board of Education?
          </div>
          <div className={styles.exampleQuery}>
            Explain the dissenting opinion in Roe v. Wade
          </div>
          <div className={styles.exampleQuery}>
            What precedents did Citizens United overturn?
          </div>
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
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [threadId, setThreadId] = useState("");

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // create a new threadID when chat component created
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
        console.log('Thread created:', data.threadId);
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

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    setIsThinking(false);
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    };
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // imageFileDone - show image in chat
  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  }

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta, snapshot) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // image
    stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

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
      })
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });

  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.length === 0 && <EmptyState />}
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        {isThinking && (
          <div className={styles.thinkingContainer}>
            <div className={styles.thinkingBubble}>
              <span className={styles.thinkingText}>Analyzing precedent</span>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={styles.inputForm}
      >
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about any Supreme Court case..."
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled}
        >
          Query
        </button>
      </form>
    </div>
  );
};

export default Chat;
