import { useReducer, useCallback } from "react";
import { AiChatState, AiChatAction } from "../types/terminal";
import { ChatMessage } from "../services/aiApi";

// AI Chat reducer
const aiChatReducer = (
  state: AiChatState,
  action: AiChatAction
): AiChatState => {
  switch (action.type) {
    case "START_AI_CHAT":
      return {
        ...state,
        isAiChatting: true,
        aiChatHistory: [],
        isAiTyping: false,
        aiInputValue: "",
      };

    case "EXIT_AI_CHAT":
      return {
        ...state,
        isAiChatting: false,
        aiChatHistory: [],
        isAiTyping: false,
        aiInputValue: "",
      };

    case "ADD_AI_MESSAGE":
      return {
        ...state,
        aiChatHistory: [...state.aiChatHistory, action.payload],
      };

    case "SET_AI_TYPING":
      return {
        ...state,
        isAiTyping: action.payload,
      };

    case "SET_AI_INPUT_VALUE":
      return {
        ...state,
        aiInputValue: action.payload,
      };

    case "CLEAR_AI_CHAT_HISTORY":
      return {
        ...state,
        aiChatHistory: [],
      };

    case "SET_AI_CHAT_STATE":
      return {
        ...state,
        isAiChatting: action.payload.isChatting,
        aiChatHistory: action.payload.history || state.aiChatHistory,
        isAiTyping: action.payload.isTyping || false,
        aiInputValue: action.payload.inputValue || "",
      };

    default:
      return state;
  }
};

// Initial AI chat state
const getInitialAiChatState = (): AiChatState => ({
  isAiChatting: false,
  aiChatHistory: [],
  isAiTyping: false,
  aiInputValue: "",
});

export const useAiChat = () => {
  const [aiChatState, dispatch] = useReducer(
    aiChatReducer,
    getInitialAiChatState()
  );

  // Action creators
  const startAiChat = useCallback(() => {
    dispatch({ type: "START_AI_CHAT" });
  }, []);

  const exitAiChat = useCallback(() => {
    dispatch({ type: "EXIT_AI_CHAT" });
  }, []);

  const addAiMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: "ADD_AI_MESSAGE", payload: message });
  }, []);

  const setAiTyping = useCallback((isTyping: boolean) => {
    dispatch({ type: "SET_AI_TYPING", payload: isTyping });
  }, []);

  const setAiInputValue = useCallback((value: string) => {
    dispatch({ type: "SET_AI_INPUT_VALUE", payload: value });
  }, []);

  const clearAiChatHistory = useCallback(() => {
    dispatch({ type: "CLEAR_AI_CHAT_HISTORY" });
  }, []);

  const setAiChatState = useCallback(
    (
      isChatting: boolean,
      history?: ChatMessage[],
      isTyping?: boolean,
      inputValue?: string
    ) => {
      dispatch({
        type: "SET_AI_CHAT_STATE",
        payload: {
          isChatting,
          history,
          isTyping,
          inputValue,
        },
      });
    },
    []
  );

  return {
    aiChatState,
    startAiChat,
    exitAiChat,
    addAiMessage,
    setAiTyping,
    setAiInputValue,
    clearAiChatHistory,
    setAiChatState,
  };
};
