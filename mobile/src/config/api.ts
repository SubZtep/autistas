/**
 * API Configuration
 * Update these values based on your environment
 */

// For development, use your local IP address instead of localhost
// iOS Simulator: localhost works
// Android Emulator: use 10.0.2.2 instead of localhost
// Physical device: use your computer's IP address on the local network

const DEV_API_URL = __DEV__
  ? "http://localhost:3000" // Change this to your local IP if testing on physical device
  : "https://static.249.244.62.46.clients.your-server.de" // Production API URL

export const API_CONFIG = {
  baseUrl: DEV_API_URL,
  endpoints: {
    health: "/health",
    chat: "/api/chat",
  },
  timeout: 30000, // 30 seconds
}
