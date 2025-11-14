import axios from 'axios';
import { API_URL } from '../config/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamResponse {
  conversationId?: string;
  text?: string;
  type: 'id' | 'chunk' | 'done' | 'error';
  error?: string;
}

export class ChatAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Send a message and receive streaming response
   * @param message User message
   * @param conversationId Optional conversation ID
   * @param onChunk Callback for each text chunk
   * @param onDone Callback when streaming is complete
   * @param onError Callback for errors
   */
  async streamChat(
    message: string,
    conversationId: string | undefined,
    onChunk: (text: string) => void,
    onDone: (conversationId: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let currentConversationId = conversationId;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete messages (SSE format: "data: {json}\n\n")
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete message in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamResponse = JSON.parse(line.slice(6));

              if (data.type === 'id' && data.conversationId) {
                currentConversationId = data.conversationId;
              } else if (data.type === 'chunk' && data.text) {
                onChunk(data.text);
              } else if (data.type === 'done') {
                if (currentConversationId) {
                  onDone(currentConversationId);
                }
              } else if (data.type === 'error') {
                onError(data.error || 'Unknown error');
              }
            } catch (parseError) {
              console.error('Failed to parse SSE message:', parseError);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('Failed to send message');
      }
    }
  }
}

export const chatAPI = new ChatAPI();
