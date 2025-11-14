import React, { useEffect, useRef } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isStreaming?: boolean
}

interface FeedProps {
  messages: Message[]
}

export const Feed: React.FC<FeedProps> = ({ messages }) => {
  const { colors } = useTheme()
  const scrollViewRef = useRef<ScrollView>(null)

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.primary }]}>Welcome! 👋</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Start a conversation below.{"\n"}
            I'm here to help!
          </Text>
        </View>
      ) : (
        messages.map(message => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.isUser ? styles.userMessageContainer : styles.aiMessageContainer]}
          >
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: message.isUser ? colors.userMessage : colors.aiMessage,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.messageText, { color: colors.text }]}>
                {message.text}
                {message.isStreaming && <Text style={styles.cursor}>▊</Text>}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: 12,
    flexDirection: "row",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  cursor: {
    opacity: 0.6,
    marginLeft: 2,
  },
})
