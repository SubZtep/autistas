import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import type { ChatRequest, ChatResponse, ErrorResponse } from "@autistas/common"
import { streamText } from "ai"
import { createOllama } from "ollama-ai-provider"
import { env } from "../config/env.js"
import { db, conversations, messages } from "../db/index.js"
import { eq } from "drizzle-orm"

const chat = new OpenAPIHono()

// Create Ollama provider instance with custom baseURL
const ollama = createOllama({
  baseURL: `${env.OLLAMA_BASE_URL}/api`,
})

// Request schema - mirrors ChatRequestSchema from @autistas/common with OpenAPI metadata
const ChatRequestSchema = z
  .object({
    message: z.string().min(1).openapi({
      example: "Hello! Can you help me understand my child's behavior?",
      description: "The message to send to the AI assistant",
    }),
    conversationId: z
      .string()
      .uuid()
      .optional()
      .openapi({
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Optional conversation ID to continue an existing conversation",
      }),
  })
  .openapi("ChatRequest") satisfies z.ZodType<ChatRequest>

// Response schema - mirrors ChatResponseSchema from @autistas/common with OpenAPI metadata
const ChatResponseSchema = z
  .object({
    message: z.string().openapi({
      example: "AI response will be connected to your home LLM server soon!",
      description: "The AI assistant's response",
    }),
    conversationId: z.string().uuid().openapi({
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "Conversation ID for maintaining chat context",
    }),
    timestamp: z.string().openapi({
      example: "2025-11-09T17:00:00.000Z",
      description: "Timestamp of the response",
    }),
  })
  .openapi("ChatResponse") satisfies z.ZodType<ChatResponse>

// Error response schema - mirrors ErrorResponseSchema from @autistas/common with OpenAPI metadata
const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      example: "Message is required",
    }),
  })
  .openapi("ErrorResponse") satisfies z.ZodType<Omit<ErrorResponse, "code">>

// Chat route definition
const chatRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Chat"],
  summary: "Send a chat message",
  description: "Send a message to the AI assistant and receive a response. Supports conversation continuity via conversationId.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ChatRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful response from the AI assistant",
      content: {
        "application/json": {
          schema: ChatResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request - validation error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

// Register OpenAPI route (placeholder for documentation)
chat.openapi(chatRoute, async c => {
  const { conversationId } = c.req.valid("json")

  const response = {
    message: "Use streaming endpoint for real-time chat",
    conversationId: conversationId || crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }

  return c.json(response, 200)
})

// Streaming chat endpoint (not in OpenAPI spec)
chat.post("/stream", async c => {
  console.log("📥 Received chat stream request")
  try {
    const body = await c.req.json()
    const userMessage = body.message as string
    const providedConversationId = body.conversationId as string | undefined
    console.log("💬 User message:", userMessage)
    console.log("🔑 Conversation ID:", providedConversationId)

    if (!userMessage) {
      return c.json({ error: "Message is required" }, 400)
    }

    // Get or create conversation ID
    let conversationId = providedConversationId

    if (!conversationId) {
      // Create new conversation
      const [newConversation] = await db
        .insert(conversations)
        .values({})
        .returning()
      conversationId = newConversation.id
    }

    // Save user message to database
    await db.insert(messages).values({
      conversationId,
      content: userMessage,
      role: "user",
    })

    // Get conversation history for context
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)

    // Build messages array for LLM (including history)
    const llmMessages = history.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))

    console.log("🤖 Calling Ollama via AI SDK")
    console.log("🔗 Ollama URL:", env.OLLAMA_BASE_URL)
    console.log("🎯 Model:", env.OLLAMA_MODEL)

    // Collect full response for database storage
    let fullResponse = ""

    // Return streaming response using Server-Sent Events
    return c.newResponse(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()

          try {
            // Send conversation ID first
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ conversationId, type: "id" })}\n\n`)
            )

            // Use AI SDK's streamText with Ollama provider
            const result = await streamText({
              model: ollama(env.OLLAMA_MODEL),
              messages: llmMessages,
              system: env.SYSTEM_PROMPT,
            })

            // Stream text chunks
            for await (const textPart of result.textStream) {
              fullResponse += textPart
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: textPart, type: "chunk" })}\n\n`)
              )
            }

            // Save assistant response to database
            await db.insert(messages).values({
              conversationId,
              content: fullResponse,
              role: "assistant",
            })

            // Send done signal
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`))
            controller.close()
          } catch (error) {
            console.error("❌ Streaming error:", error)
            console.error("Error details:", JSON.stringify(error, null, 2))
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "Failed to generate response" })}\n\n`
              )
            )
            controller.close()
          }
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    )
  } catch (error) {
    console.error("Chat error:", error)
    return c.json({ error: "Failed to process chat message" }, 500)
  }
})

export default chat
