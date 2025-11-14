import { API_URL } from "../config/api"
import EventSource from "react-native-sse"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface StreamResponse {
  conversationId?: string
  text?: string
  type: "id" | "chunk" | "done" | "error"
  error?: string
}

export class ChatAPI {
  private baseURL: string

  constructor() {
    this.baseURL = API_URL
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
    let currentConversationId = conversationId
    let es: EventSource | null = null

    try {
      es = new EventSource(`${this.baseURL}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      })

      es.addEventListener("message", (event) => {
        try {
          const data: StreamResponse = JSON.parse(event.data || "{}")

          if (data.type === "id" && data.conversationId) {
            currentConversationId = data.conversationId
          } else if (data.type === "chunk" && data.text) {
            onChunk(data.text)
          } else if (data.type === "done") {
            if (currentConversationId) {
              onDone(currentConversationId)
            }
            es?.close()
          } else if (data.type === "error") {
            onError(data.error || "Unknown error")
            es?.close()
          }
        } catch (parseError) {
          console.error("Failed to parse SSE message:", parseError)
        }
      })

      es.addEventListener("error", (event) => {
        console.error("SSE error:", event)
        const errorMessage =
          "message" in event && typeof event.message === "string"
            ? event.message
            : "Connection error"
        onError(errorMessage)
        es?.close()
      })
    } catch (error) {
      es?.close()
      if (error instanceof Error) {
        onError(error.message)
      } else {
        onError("Failed to send message")
      }
    }
  }
}

export const chatAPI = new ChatAPI()
