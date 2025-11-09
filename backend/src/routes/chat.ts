import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

const chat = new OpenAPIHono()

// Request schema
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
  .openapi("ChatRequest")

// Response schema
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
  .openapi("ChatResponse")

// Error response schema
const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      example: "Message is required",
    }),
  })
  .openapi("ErrorResponse")

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

// Register route
chat.openapi(chatRoute, async c => {
  const { message, conversationId } = c.req.valid("json")

  // TODO: Implement LLM API call
  // For now, return a placeholder response
  const response = {
    message: "AI response will be connected to your home LLM server soon!",
    conversationId: conversationId || crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }

  return c.json(response, 200)
})

export default chat
