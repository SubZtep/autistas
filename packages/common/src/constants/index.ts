/**
 * Shared constants used across the application
 */

export const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
} as const

export const API_ENDPOINTS = {
  HEALTH: "/health",
  CHAT: "/chat",
} as const

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const

export type MessageRole = (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES]
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
