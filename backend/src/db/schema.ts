import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

/**
 * Conversations table
 * Stores chat conversations
 */
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'), // For future authentication
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Messages table
 * Stores individual chat messages
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  role: text('role').notNull(), // 'user' or 'assistant'
  metadata: jsonb('metadata'), // For storing additional context
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
