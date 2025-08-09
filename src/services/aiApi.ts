// AI API Client
// Integration with AI backend service for the ai command

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  context?: string; // Optional context about the portfolio
}

export interface ChatResponse {
  response: string;
  timestamp: number;
}

export interface TypingIndicator {
  isTyping: boolean;
  message?: string;
}

// Configuration - update this with your deployed AI backend URL
// For development, use local backend. For production, replace with your deployed URL
const AI_BASE_URL = import.meta.env.VITE_AI_BACKEND_URL || "/api/ai"; // Use nginx proxy

export class AiApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AiApiError";
  }
}

/**
 * Send a message to the AI backend and get a response
 * @param message The user's message
 * @param history Previous conversation history
 * @returns Promise with AI response
 */
export async function sendMessageToAI(
  message: string,
  history: ChatMessage[] = [],
  sessionToken?: string
): Promise<ChatResponse> {
  try {
    const requestBody: ChatRequest = {
      message,
      history,
      context: `This is a conversation with an AI assistant integrated into a developer portfolio. 
      The portfolio is a React application that simulates a terminal interface with various commands like ls, cd, grep, man, top, curl, etc. 
      The user is interacting with this portfolio through a terminal-like interface. 
      The AI should be helpful, knowledgeable about software development, and maintain a conversational tone.`,
    };

    const response = await fetch(`${AI_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new AiApiError(
        `Failed to get AI response: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return {
      response: data.response,
      timestamp: Date.now(),
    } as ChatResponse;
  } catch (error) {
    if (error instanceof AiApiError) {
      throw error;
    }
    throw new AiApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Test the AI backend connection
 * @returns Promise indicating if the service is available
 */
export async function testAiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${AI_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}
