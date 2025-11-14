const WELCOME_HEADER = ["Hello! 👋", "Hey! 👋", "Hi there! 👋", "Ciao! 👋"]

const WELCOME_BODY = [
  "I’m with you.",
  "How can I help you today?",
  "What would you like to talk about?",
  "What’s on your mind?",
  "What’s bothering you?",
  "What’s worrying you?",
]

export function getWelcomeMessage() {
  return {
    header: WELCOME_HEADER[Math.floor(Math.random() * WELCOME_HEADER.length)],
    body: WELCOME_BODY[Math.floor(Math.random() * WELCOME_BODY.length)],
  }
}
