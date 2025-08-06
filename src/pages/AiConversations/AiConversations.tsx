import React, { useEffect, useRef, useReducer, useCallback } from "react";
import "./AiConversations.css";
import { sendMessageToAI } from "../../services/aiApi";
import TypeWriterText from "../../components/TypeWriterText";

// Utility function to generate unique IDs
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

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

// Define the state shape
interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentMessage: string;
  viewMode: "chat" | "history";
  status: "idle" | "typing" | "error";
  pendingMessage: Message | null;
  lastMessageId: string | null;
}

// Define the actions
type ChatAction =
  | { type: "LOAD_CONVERSATIONS"; payload: Conversation[] }
  | { type: "START_NEW_CONVERSATION" }
  | { type: "SET_VIEW_MODE"; payload: "chat" | "history" }
  | { type: "SET_CURRENT_MESSAGE"; payload: string }
  | { type: "SEND_MESSAGE_START"; payload: { message: string } }
  | {
      type: "SEND_MESSAGE_SUCCESS";
      payload: { aiResponse: string };
    }
  | { type: "SEND_MESSAGE_ERROR" }
  | {
      type: "CLEAR_NEW_FLAG";
      payload: { conversationId: string; messageId: string };
    }
  | { type: "DELETE_CONVERSATION"; payload: string }
  | { type: "CLEAR_ALL_CONVERSATIONS" }
  | { type: "SELECT_CONVERSATION"; payload: string };

// Initial state
const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  currentMessage: "",
  viewMode: "chat",
  status: "idle",
  pendingMessage: null,
  lastMessageId: null,
};

// The reducer function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "LOAD_CONVERSATIONS":
      return {
        ...state,
        conversations: action.payload,
        activeConversationId:
          action.payload.length > 0 ? action.payload[0].id : null,
      };

    case "START_NEW_CONVERSATION": {
      const newConversation = {
        id: generateUniqueId(),
        timestamp: Date.now(),
        messages: [],
      };
      const updatedConversations = [newConversation, ...state.conversations];

      // Save to localStorage
      localStorage.setItem(
        "ai-conversations",
        JSON.stringify(updatedConversations)
      );

      return {
        ...state,
        conversations: updatedConversations,
        activeConversationId: newConversation.id,
        pendingMessage: null,
        viewMode: "chat",
      };
    }

    case "SET_VIEW_MODE":
      return {
        ...state,
        viewMode: action.payload,
      };

    case "SET_CURRENT_MESSAGE":
      return {
        ...state,
        currentMessage: action.payload,
      };

    case "SEND_MESSAGE_START": {
      const pendingMessageData = {
        id: generateUniqueId(),
        timestamp: Date.now(),
        userMessage: action.payload.message,
        aiResponse: "", // Empty for now
        isNew: true, // It's new from the start
      };

      return {
        ...state,
        currentMessage: "",
        status: "typing",
        pendingMessage: pendingMessageData,
      };
    }

    case "SEND_MESSAGE_SUCCESS": {
      // Guard against this action being called without a pending message
      if (!state.pendingMessage) return state;

      // 1. Create the final message by updating the pending one.
      const completedMessage: Message = {
        ...state.pendingMessage,
        aiResponse: action.payload.aiResponse,
      };

      // 2. Your existing logic for finding/creating the conversation.
      let updatedConversations = [...state.conversations];
      let activeConvId = state.activeConversationId;

      // If no conversations exist, create the first one.
      if (updatedConversations.length === 0) {
        const newConversation = {
          id: generateUniqueId(),
          timestamp: Date.now(),
          messages: [completedMessage],
        };
        updatedConversations = [newConversation];
        activeConvId = newConversation.id;
      } else {
        // Add to the active conversation.
        const activeConvIndex = updatedConversations.findIndex(
          (c) => c.id === activeConvId
        );
        if (activeConvIndex !== -1) {
          const newMessages = [
            ...updatedConversations[activeConvIndex].messages,
            completedMessage,
          ];
          updatedConversations[activeConvIndex] = {
            ...updatedConversations[activeConvIndex],
            messages: newMessages,
            timestamp: Date.now(),
          };
        }
      }

      // Limit total conversations to 50
      if (updatedConversations.length > 50) {
        updatedConversations.splice(50);
      }

      // 3. Save to localStorage
      localStorage.setItem(
        "ai-conversations",
        JSON.stringify(updatedConversations)
      );

      // 4. Return the new state, clearing the pending message.
      return {
        ...state,
        conversations: updatedConversations,
        activeConversationId: activeConvId,
        status: "idle",
        pendingMessage: null, // It's no longer pending!
        lastMessageId: completedMessage.id,
      };
    }

    case "SEND_MESSAGE_ERROR":
      return {
        ...state,
        status: "error",
        pendingMessage: null,
      };

    case "CLEAR_NEW_FLAG": {
      const { conversationId, messageId } = action.payload;
      const updatedConversations = state.conversations.map((conv) => {
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

      localStorage.setItem(
        "ai-conversations",
        JSON.stringify(updatedConversations)
      );

      return {
        ...state,
        conversations: updatedConversations,
      };
    }

    case "DELETE_CONVERSATION": {
      const updatedConversations = state.conversations.filter(
        (conv) => conv.id !== action.payload
      );
      localStorage.setItem(
        "ai-conversations",
        JSON.stringify(updatedConversations)
      );

      return {
        ...state,
        conversations: updatedConversations,
        activeConversationId:
          updatedConversations.length > 0 ? updatedConversations[0].id : null,
      };
    }

    case "CLEAR_ALL_CONVERSATIONS":
      localStorage.removeItem("ai-conversations");
      return {
        ...state,
        conversations: [],
        activeConversationId: null,
      };

    case "SELECT_CONVERSATION":
      return {
        ...state,
        activeConversationId: action.payload,
        viewMode: "chat",
      };

    default:
      return state;
  }
}

const AiConversations: React.FC = () => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);

  // Type guard for conversation items
  function isConversationItem(item: unknown): item is {
    id?: number | string;
    timestamp?: number;
    userMessage?: string;
    aiResponse?: string;
    messages?: unknown[];
  } {
    return (
      item !== null &&
      typeof item === "object" &&
      ((item as Record<string, unknown>).userMessage !== undefined ||
        (item as Record<string, unknown>).messages !== undefined)
    );
  }

  // Migrate old conversation format to new format
  const migrateOldFormat = useCallback((data: unknown[]): Conversation[] => {
    return data
      .map((item) => {
        if (!isConversationItem(item)) {
          return null;
        }

        // Check if it's the old format (has userMessage and aiResponse directly)
        if (item.userMessage && item.aiResponse && !item.messages) {
          // Convert old format to new format
          return {
            id: item.id?.toString() || generateUniqueId(),
            timestamp: item.timestamp || Date.now(),
            messages: [
              {
                id: item.id?.toString() || generateUniqueId(),
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
          // Ensure the item has the correct Conversation structure
          const conversation = item as Record<string, unknown>;
          return {
            id: conversation.id?.toString() || generateUniqueId(),
            timestamp: conversation.timestamp || Date.now(),
            messages: conversation.messages || [],
          };
        }

        // Skip invalid items
        return null;
      })
      .filter(Boolean) as Conversation[];
  }, []);

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem("ai-conversations");
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);

        // Migrate old format to new format if needed
        const migratedConversations = migrateOldFormat(parsed);
        dispatch({
          type: "LOAD_CONVERSATIONS",
          payload: migratedConversations,
        });
      } catch (error) {
        console.error("Failed to parse saved conversations:", error);
        // Clear corrupted data
        localStorage.removeItem("ai-conversations");
      }
    }
  }, [migrateOldFormat]);

  // Optimized scroll effect - only triggers when a new message is added
  useEffect(() => {
    if (state.lastMessageId && messagesContainerRef.current) {
      const container = messagesContainerRef.current;

      // Check if the user is near the bottom
      const isScrolledToBottom =
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + 100;

      if (isScrolledToBottom) {
        // Let the browser handle the smooth animation
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [state.lastMessageId]);

  // Initial scroll to bottom on first load
  useEffect(() => {
    if (isInitialLoad.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
      isInitialLoad.current = false;
    }
  }, [state.conversations]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const clearConversations = () => {
    if (window.confirm("Are you sure you want to clear all conversations?")) {
      dispatch({ type: "CLEAR_ALL_CONVERSATIONS" });
    }
  };

  const deleteConversation = (id: string) => {
    dispatch({ type: "DELETE_CONVERSATION", payload: id });
  };

  const handleSendMessage = async () => {
    if (!state.currentMessage.trim() || state.status === "typing") return;

    const userMessage = state.currentMessage.trim();

    // 1. Dispatch the start action. This will create the pending message in the state.
    dispatch({ type: "SEND_MESSAGE_START", payload: { message: userMessage } });

    try {
      // Send message to AI
      const response = await sendMessageToAI(userMessage, []);

      // 2. Dispatch the success action.
      // DO NOT create a new message object here. The reducer will handle it.
      dispatch({
        type: "SEND_MESSAGE_SUCCESS",
        payload: {
          aiResponse: response.response,
          // The reducer will get the userMessage from the pendingMessage in the state.
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch({ type: "SEND_MESSAGE_ERROR" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearNewFlag = (conversationId: string, messageId: string) => {
    dispatch({
      type: "CLEAR_NEW_FLAG",
      payload: { conversationId, messageId },
    });
  };

  const startNewConversation = () => {
    dispatch({ type: "START_NEW_CONVERSATION" });
  };

  const selectConversation = (conversation: Conversation) => {
    dispatch({ type: "SELECT_CONVERSATION", payload: conversation.id });
  };

  // Get the currently active conversation
  const activeConversation =
    state.conversations.find(
      (conv) => conv.id === state.activeConversationId
    ) || state.conversations[0];

  return (
    <div className="ai-conversations">
      <div className="conversations-header">
        <h2>Chat with Kareem</h2>
        <div className="header-controls">
          <div className="view-toggle">
            {state.viewMode === "chat" ? (
              <button
                className="toggle-btn"
                onClick={() =>
                  dispatch({ type: "SET_VIEW_MODE", payload: "history" })
                }
              >
                📚 History
              </button>
            ) : (
              <button
                className="toggle-btn"
                onClick={() =>
                  dispatch({ type: "SET_VIEW_MODE", payload: "chat" })
                }
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

      {state.viewMode === "chat" ? (
        <div className="chat-interface">
          <div className="chat-messages" ref={messagesContainerRef}>
            {state.conversations.length === 0 && !state.pendingMessage ? (
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
            ) : state.conversations.length > 0 &&
              state.conversations[0].messages.length === 0 &&
              !state.pendingMessage ? (
              <div className="welcome-message">
                <div className="welcome-icon">💬</div>
                <h2>New Conversation Started!</h2>
                <p>
                  You&apos;re in a fresh conversation. Send a message to begin
                  chatting.
                </p>
              </div>
            ) : (
              <>
                {/* Show pending message if exists */}
                {state.pendingMessage && (
                  <div className="chat-conversation">
                    <div className="message user-message">
                      <div className="message-header">
                        <span className="user-icon">👤</span>
                        <span className="message-label">You</span>
                      </div>
                      <div className="message-content">
                        {state.pendingMessage.userMessage}
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
                value={state.currentMessage}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CURRENT_MESSAGE",
                    payload: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="chat-input"
                disabled={state.status === "typing"}
              />
              <button
                onClick={handleSendMessage}
                disabled={
                  !state.currentMessage.trim() || state.status === "typing"
                }
                className="send-button"
              >
                {state.status === "typing" ? "⏳" : "➤"}
              </button>
            </div>
          </div>
        </div>
      ) : // History view (existing code)
      state.conversations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>No conversations yet</h2>
          <p>Start chatting with the AI to see your conversations here!</p>
          <button
            onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "chat" })}
            className="start-chat-button"
          >
            Start Chatting
          </button>
        </div>
      ) : (
        <div className="conversations-layout">
          <div className="conversations-list">
            <div className="conversations-header-row">
              <h3>Recent Conversations ({state.conversations.length})</h3>
              {state.conversations.length > 0 && (
                <button onClick={clearConversations} className="clear-button">
                  Clear All
                </button>
              )}
            </div>
            <div className="conversation-items">
              {state.conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    state.activeConversationId === conversation.id
                      ? "selected"
                      : ""
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

          {activeConversation && (
            <div className="conversation-detail">
              <div className="detail-header">
                <h3>Conversation Details</h3>
                <span className="detail-date">
                  {formatDate(activeConversation.timestamp)}
                </span>
              </div>

              <div className="conversation-messages">
                {activeConversation.messages?.map((message) => (
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
