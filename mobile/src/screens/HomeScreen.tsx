import React, { useRef, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { chatAPI } from "../api/chatApi"
import { ChatInput } from "../components/ChatInput"
import { Feed } from "../components/Feed"
import { Header } from "../components/Header"
import { useTheme } from "../theme/ThemeContext"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isStreaming?: boolean
}

export const HomeScreen = () => {
  const { colors } = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const conversationIdRef = useRef<string | undefined>(undefined)
  const streamingMessageIdRef = useRef<string | null>(null)

  const handleSendMessage = async (text: string) => {
    if (isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString()
    streamingMessageIdRef.current = aiMessageId

    const aiMessage: Message = {
      id: aiMessageId,
      text: "",
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages(prev => [...prev, aiMessage])

    // Stream response from backend
    await chatAPI.streamChat(
      text,
      conversationIdRef.current,
      // onChunk
      (chunk: string) => {
        setMessages(prev => prev.map(msg => (msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg)))
      },
      // onDone
      (conversationId: string) => {
        conversationIdRef.current = conversationId
        setMessages(prev => prev.map(msg => (msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg)))
        setIsLoading(false)
        streamingMessageIdRef.current = null
      },
      // onError
      (error: string) => {
        console.error("Chat error:", error)
        setMessages(prev =>
          prev.map(msg => (msg.id === aiMessageId ? { ...msg, text: `Error: ${error}`, isStreaming: false } : msg)),
        )
        setIsLoading(false)
        streamingMessageIdRef.current = null
        Alert.alert("Error", `Failed to get response: ${error}`)
      },
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <Feed messages={messages} />
      <ChatInput onSend={handleSendMessage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
