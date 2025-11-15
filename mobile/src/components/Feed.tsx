import AntDesign from "@expo/vector-icons/AntDesign"
import React, { useEffect, useRef } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTheme } from "../theme/ThemeContext"
import WelcomeBadge from "./layout/WelcomeBadge"
import ImageBg from "./ui/ImageBg"

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
      <ImageBg />
      {messages.length === 0 ? (
        <WelcomeBadge />
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
                {message.isStreaming && (
                  <AntDesign name="robot" size={16} color={colors.textTertiary} style={{ marginLeft: 2 }} />
                )}
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
})
