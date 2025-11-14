/**
 * Database models shared between backend and mobile
 * These types should match the database schema
 */

export interface Conversation {
  id: string
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  conversationId: string
  content: string
  role: "user" | "assistant"
  metadata?: Record<string, unknown> | null
  createdAt: Date
}

/**
 * Types for creating new records
 */
export type NewConversation = Omit<Conversation, "id" | "createdAt" | "updatedAt">
export type NewMessage = Omit<Message, "id" | "createdAt">
