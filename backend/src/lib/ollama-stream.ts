/**
 * Custom Ollama streaming implementation using native fetch
 * This bypasses the buggy ollama-ai-provider package
 */

export interface OllamaMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface OllamaStreamOptions {
  baseURL: string
  model: string
  messages: OllamaMessage[]
  system?: string
}

export async function* streamOllamaChat(options: OllamaStreamOptions): AsyncGenerator<string> {
  const { baseURL, model, messages, system } = options

  const payload = {
    model,
    messages: system ? [{ role: "system" as const, content: system }, ...messages] : messages,
    stream: true,
  }

  const response = await fetch(`${baseURL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
  }

  if (!response.body) {
    throw new Error("No response body from Ollama")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n").filter(line => line.trim())

      for (const line of lines) {
        try {
          const data = JSON.parse(line)

          if (data.message?.content) {
            yield data.message.content
          }

          if (data.done) {
            return
          }
        } catch {
          // Skip malformed JSON lines
          console.warn("Failed to parse Ollama response line:", line)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
