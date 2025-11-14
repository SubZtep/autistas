import { z } from "zod"

/**
 * Chat request schema
 * Used when sending a message to the AI assistant
 */
export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().uuid().optional(),
})

/**
 * Chat response schema
 * Returned from the AI assistant
 */
export const ChatResponseSchema = z.object({
  message: z.string(),
  conversationId: z.string().uuid(),
  timestamp: z.string().datetime(),
})

/**
 * Error response schema
 * Returned when an error occurs
 */
export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
})

// Infer TypeScript types from schemas
export type ChatRequest = z.infer<typeof ChatRequestSchema>
export type ChatResponse = z.infer<typeof ChatResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
