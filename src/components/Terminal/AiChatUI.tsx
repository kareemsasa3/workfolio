import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../../services/aiApi";
import "./AiChatUI.css";

interface AiChatUIProps {
  chatHistory: ChatMessage[];
  isTyping: boolean;
  inputValue: string;
  onSendMessage: (message: string) => void;
  onInputChange: (value: string) => void;
  onExit: () => void;
}

export const AiChatUI: React.FC<AiChatUIProps> = ({
  chatHistory,
  isTyping,
  inputValue,
  onSendMessage,
  onInputChange,
  onExit,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Test connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { testAiConnection } = await import("../../services/aiApi");
        const connected = await testAiConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      }
    };
    testConnection();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onExit();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isConnected === false) {
    return (
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <span className="ai-icon">🤖</span>
            AI Assistant
          </div>
          <button className="ai-chat-close" onClick={onExit}>
            ✕
          </button>
        </div>
        <div className="ai-chat-error">
          <div className="ai-chat-error-icon">⚠️</div>
          <div className="ai-chat-error-title">Connection Error</div>
          <div className="ai-chat-error-message">
            Unable to connect to AI service. Please check your internet
            connection and try again later.
          </div>
          <button
            className="ai-chat-error-retry"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <span className="ai-icon">🤖</span>
          AI Assistant
          {isConnected === null && (
            <span className="ai-connecting">Connecting...</span>
          )}
          {isConnected === true && (
            <span className="ai-connected">● Connected</span>
          )}
        </div>
        <button className="ai-chat-close" onClick={onExit}>
          ✕
        </button>
      </div>

      <div className="ai-chat-messages">
        {chatHistory.length === 0 && (
          <div className="ai-chat-welcome">
            <div className="ai-chat-welcome-icon">🤖</div>
            <div className="ai-chat-welcome-title">
              Hello! I&apos;m your AI assistant.
            </div>
            <div className="ai-chat-welcome-message">
              I can help you explore this portfolio, answer questions about the
              technologies used, or assist with any development-related topics.
              What would you like to know?
            </div>
            <div className="ai-chat-suggestions">
              <button
                className="ai-suggestion-btn"
                onClick={() => onSendMessage("Tell me about this portfolio")}
              >
                Tell me about this portfolio
              </button>
              <button
                className="ai-suggestion-btn"
                onClick={() => onSendMessage("What technologies did you use?")}
              >
                What technologies did you use?
              </button>
              <button
                className="ai-suggestion-btn"
                onClick={() => onSendMessage("How does the terminal work?")}
              >
                How does the terminal work?
              </button>
            </div>
          </div>
        )}

        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`ai-message ${
              message.role === "user" ? "ai-user" : "ai-assistant"
            }`}
          >
            <div className="ai-message-content">
              <div className="ai-message-text">{message.content}</div>
              <div className="ai-message-time">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
            <div className="ai-message-avatar">
              {message.role === "user" ? "👤" : "🤖"}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="ai-message ai-assistant">
            <div className="ai-message-content">
              <div className="ai-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="ai-message-avatar">🤖</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-input-container" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="ai-chat-input"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Esc to exit)"
          disabled={isTyping}
        />
        <button
          type="submit"
          className="ai-chat-send"
          disabled={!inputValue.trim() || isTyping}
        >
          ➤
        </button>
      </form>
    </div>
  );
};
