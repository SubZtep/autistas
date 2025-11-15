/**
 * API Configuration
 * Values are managed through:
 * - Development: Local override or app.config.js fallback
 * - Production: EAS Secret EXPO_PUBLIC_API_URL or app.config.js fallback
 */

import Constants from "expo-constants"

// Get API URL from expo config (which reads from EXPO_PUBLIC_API_URL env var)
const getApiUrl = (): string => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl

  // For local development with expo start
  if (__DEV__) {
    // Use configured URL or default to localhost for development
    return apiUrl || "http://localhost:3000"
  }

  // For production builds, require EXPO_PUBLIC_API_URL to be set
  if (!apiUrl) {
    throw new Error(
      "EXPO_PUBLIC_API_URL environment variable is required for production builds. " +
        "Set it via EAS secrets: eas secret:create --name EXPO_PUBLIC_API_URL",
    )
  }

  return apiUrl
}

export const API_URL = getApiUrl()
