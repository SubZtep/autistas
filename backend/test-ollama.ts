import { streamText } from "ai"
import { createOllama } from "ollama-ai-provider"

const ollama = createOllama({
  baseURL: "http://localhost:11434",
})

async function testOllama() {
  console.log("🧪 Testing Ollama with AI SDK...")

  try {
    const result = await streamText({
      model: ollama("smollm2"),
      messages: [{ role: "user", content: "Say hello in 5 words or less" }],
    })

    console.log("📝 Trying to get full text...")

    // Set a timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout after 10 seconds")), 10000)
    )

    const fullText = await Promise.race([result.text, timeoutPromise]) as string

    console.log("✅ Done! Total length:", fullText.length)
    console.log("Full text:", fullText)
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

testOllama().catch(console.error)
