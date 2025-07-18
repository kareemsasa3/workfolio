import React, { useState, useEffect, useRef } from "react";
import "./AiConversations.css";
import { sendMessageToAI } from "../../services/aiApi";
import TypeWriterText from "../../components/TypeWriterText";

interface Message {
  id: string;
  timestamp: number;
  userMessage: string;
  aiResponse: string;
  isNew?: boolean;
}

interface Conversation {
  id: string;
  timestamp: number;
  messages: Message[];
}

const AiConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState<"chat" | "history">("chat");
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem("ai-conversations");
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);

        // Migrate old format to new format if needed
        const migratedConversations = migrateOldFormat(parsed);
        setConversations(migratedConversations);
      } catch (error) {
        console.error("Failed to parse saved conversations:", error);
        // Clear corrupted data
        localStorage.removeItem("ai-conversations");
      }
    }
  }, []);

  // Migrate old conversation format to new format
  const migrateOldFormat = (data: any[]): Conversation[] => {
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => {
        // Check if it's the old format (has userMessage and aiResponse directly)
        if (item.userMessage && item.aiResponse && !item.messages) {
          // Convert old format to new format
          return {
            id: item.id || Date.now().toString(),
            timestamp: item.timestamp || Date.now(),
            messages: [
              {
                id: item.id || Date.now().toString(),
                timestamp: item.timestamp || Date.now(),
                userMessage: item.userMessage,
                aiResponse: item.aiResponse,
                isNew: false,
              },
            ],
          };
        }

        // If it's already the new format, return as is
        if (item.messages && Array.isArray(item.messages)) {
          return item;
        }

        // Skip invalid items
        return null;
      })
      .filter(Boolean) as Conversation[];
  };

  useEffect(() => {
    // Use a separate ref for the scrollable container itself
    const container = messagesContainerRef.current;

    if (container) {
      // We only want to auto-scroll if the user is already near the bottom.
      // This prevents the view from jumping if the user has scrolled up to read old messages.
      const isScrolledToBottom =
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + 100; // 100px threshold

      // Always scroll on the initial load, but ONLY for the chat window
      if (isInitialLoad.current) {
        // Set scroll position directly to the bottom without smooth scrolling
        container.scrollTop = container.scrollHeight;
        isInitialLoad.current = false;
        return;
      }

      // For new messages, only scroll if the user was already at the bottom
      if (isScrolledToBottom) {
        // Use a custom smooth scroll that only affects the container
        const targetScrollTop = container.scrollHeight - container.clientHeight;
        const startScrollTop = container.scrollTop;
        const distance = targetScrollTop - startScrollTop;
        const duration = 300; // 300ms for smooth animation
        let startTime: number | null = null;

        const animateScroll = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);

          // Easing function for smooth animation
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);

          container.scrollTop = startScrollTop + distance * easeOutCubic;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      }
    }
  }, [conversations]); // The dependency is still correct

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const clearConversations = () => {
    if (window.confirm("Are you sure you want to clear all conversations?")) {
      localStorage.removeItem("ai-conversations");
      setConversations([]);
      setSelectedConversation(null);
    }
  };

  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== id);
    localStorage.setItem(
      "ai-conversations",
      JSON.stringify(updatedConversations)
    );
    setConversations(updatedConversations);
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage("");
    setIsTyping(true);

    // Create pending message immediately
    const pendingMessageData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      userMessage,
      aiResponse: "",
    };
    setPendingMessage(pendingMessageData);

    try {
      // Send message to AI
      const response = await sendMessageToAI(userMessage, []);

      // Update the pending message with AI response
      const completedMessage = {
        ...pendingMessageData,
        aiResponse: response.response,
        isNew: true, // Mark as new for typewriter effect
      };

      // Add to current conversation or create new one
      let updatedConversations = [...conversations];

      if (updatedConversations.length === 0) {
        // Create new conversation
        const newConversation = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          messages: [completedMessage],
        };
        updatedConversations = [newConversation];
        setActiveConversationId(newConversation.id);
      } else {
        // Add to most recent conversation
        updatedConversations[0].messages.push(completedMessage);
        updatedConversations[0].timestamp = Date.now(); // Update conversation timestamp
        setActiveConversationId(updatedConversations[0].id);
      }

      // Limit total conversations to 50
      if (updatedConversations.length > 50) {
        updatedConversations.splice(50);
      }

      // Save to localStorage
      localStorage.setItem(
        "ai-conversations",
        JSON.stringify(updatedConversations)
      );
      setConversations(updatedConversations);
      setPendingMessage(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove pending message on error
      setPendingMessage(null);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearNewFlag = (conversationId: string, messageId: string) => {
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map((msg) =>
            msg.id === messageId ? { ...msg, isNew: false } : msg
          ),
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    localStorage.setItem(
      "ai-conversations",
      JSON.stringify(updatedConversations)
    );
  };

  const startNewConversation = () => {
    // Create a new conversation with a unique ID
    const newConversation = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      messages: [],
    };

    // Add the new conversation to the beginning of the list
    const updatedConversations = [newConversation, ...conversations];

    // Save to localStorage
    localStorage.setItem(
      "ai-conversations",
      JSON.stringify(updatedConversations)
    );
    setConversations(updatedConversations);
    setActiveConversationId(newConversation.id);

    // Clear any pending message
    setPendingMessage(null);
  };

  const selectConversation = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    setViewMode("chat");
  };

  // Get the currently active conversation
  const activeConversation =
    conversations.find((conv) => conv.id === activeConversationId) ||
    conversations[0];

  return (
    <div className="ai-conversations">
      <div className="conversations-header">
        <h2>Chat with Kareem</h2>
        <div className="header-controls">
          <div className="view-toggle">
            {viewMode === "chat" ? (
              <button
                className="toggle-btn"
                onClick={() => setViewMode("history")}
              >
                📚 History
              </button>
            ) : (
              <button
                className="toggle-btn"
                onClick={() => setViewMode("chat")}
              >
                💬 Current Chat
              </button>
            )}
          </div>
          <div className="action-buttons">
            <button
              onClick={startNewConversation}
              className="new-conversation-button"
            >
              ✨ New Chat
            </button>
          </div>
        </div>
      </div>

      {viewMode === "chat" ? (
        <div className="chat-interface">
          <div className="chat-messages" ref={messagesContainerRef}>
            {conversations.length === 0 && !pendingMessage ? (
              <div className="welcome-message">
                <h2>Welcome to Kareem AI</h2>
                <p>
                  Start a conversation. Ask me anything about this portfolio, my
                  skills, or just have a friendly chat!
                </p>
                <button
                  onClick={startNewConversation}
                  className="start-chat-button"
                >
                  Start Your First Chat
                </button>
              </div>
            ) : conversations.length > 0 &&
              conversations[0].messages.length === 0 &&
              !pendingMessage ? (
              <div className="welcome-message">
                <div className="welcome-icon">💬</div>
                <h2>New Conversation Started!</h2>
                <p>
                  You're in a fresh conversation. Send a message to begin
                  chatting.
                </p>
              </div>
            ) : (
              <>
                {/* Show pending message if exists */}
                {pendingMessage && (
                  <div className="chat-conversation">
                    <div className="message user-message">
                      <div className="message-header">
                        <span className="user-icon">👤</span>
                        <span className="message-label">You</span>
                      </div>
                      <div className="message-content">
                        {pendingMessage.userMessage}
                      </div>
                    </div>

                    <div className="message ai-message">
                      <div className="message-header">
                        <span className="ai-icon">🤖</span>
                        <span className="message-label">Kareem AI</span>
                      </div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show current conversation messages */}
                {activeConversation &&
                  activeConversation.messages.length > 0 &&
                  activeConversation.messages.map((message) => (
                    <div key={message.id} className="chat-conversation">
                      <div className="message user-message">
                        <div className="message-header">
                          <span className="user-icon">👤</span>
                          <span className="message-label">You</span>
                        </div>
                        <div className="message-content">
                          {message.userMessage}
                        </div>
                      </div>

                      <div className="message ai-message">
                        <div className="message-header">
                          <span className="ai-icon">🤖</span>
                          <span className="message-label">Kareem AI</span>
                        </div>
                        <div className="message-content">
                          {message.isNew ? (
                            <TypeWriterText
                              text={message.aiResponse}
                              onComplete={() =>
                                clearNewFlag(activeConversation.id, message.id)
                              }
                            />
                          ) : (
                            message.aiResponse
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="chat-input"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="send-button"
              >
                {isTyping ? "⏳" : "➤"}
              </button>
            </div>
          </div>
        </div>
      ) : // History view (existing code)
      conversations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>No conversations yet</h2>
          <p>Start chatting with the AI to see your conversations here!</p>
          <button
            onClick={() => setViewMode("chat")}
            className="start-chat-button"
          >
            Start Chatting
          </button>
        </div>
      ) : (
        <div className="conversations-layout">
          <div className="conversations-list">
            <div className="conversations-header-row">
              <h3>Recent Conversations ({conversations.length})</h3>
              {conversations.length > 0 && (
                <button onClick={clearConversations} className="clear-button">
                  Clear All
                </button>
              )}
            </div>
            <div className="conversation-items">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    activeConversationId === conversation.id ? "selected" : ""
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="conversation-preview">
                    <div className="conversation-message">
                      <span className="user-icon">👤</span>
                      <span className="message-text">
                        {conversation.messages?.[0]?.userMessage?.length > 200
                          ? `${conversation.messages[0].userMessage.substring(
                              0,
                              200
                            )}...`
                          : conversation.messages?.[0]?.userMessage ||
                            "Empty conversation"}
                      </span>
                    </div>
                    <div className="conversation-message">
                      <span className="ai-icon">🤖</span>
                      <span className="message-text">
                        {conversation.messages?.[0]?.aiResponse?.length > 200
                          ? `${conversation.messages[0].aiResponse.substring(
                              0,
                              200
                            )}...`
                          : conversation.messages?.[0]?.aiResponse ||
                            "No response"}
                      </span>
                    </div>
                    {conversation.messages?.length > 1 && (
                      <div className="conversation-count">
                        +{conversation.messages.length - 1} more messages
                      </div>
                    )}
                  </div>
                  <div className="conversation-meta">
                    <span className="conversation-date">
                      {formatDate(conversation.timestamp)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className="delete-button"
                      title="Delete conversation"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedConversation && (
            <div className="conversation-detail">
              <div className="detail-header">
                <h3>Conversation Details</h3>
                <span className="detail-date">
                  {formatDate(selectedConversation.timestamp)}
                </span>
              </div>

              <div className="conversation-messages">
                {selectedConversation.messages?.map((message) => (
                  <div key={message.id} className="chat-conversation">
                    <div className="message user-message">
                      <div className="message-header">
                        <span className="user-icon">👤</span>
                        <span className="message-label">You</span>
                      </div>
                      <div className="message-content">
                        {message.userMessage}
                      </div>
                    </div>

                    <div className="message ai-message">
                      <div className="message-header">
                        <span className="ai-icon">🤖</span>
                        <span className="message-label">AI Assistant</span>
                      </div>
                      <div className="message-content">
                        {message.aiResponse}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiConversations;
