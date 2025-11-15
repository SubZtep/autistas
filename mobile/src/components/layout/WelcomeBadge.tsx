import { useTheme } from "@/theme/ThemeContext"
import { StyleSheet, Text, View } from "react-native"

export default function WelcomeBadge() {
  const WELCOME_HEADER = ["Hello! 👋", "Hey! 👋", "Hi there! 👋", "Ciao! 👋"]

  const WELCOME_BODY = [
    "I’m with you.",
    "How can I help you today?",
    "What would you like to talk about?",
    "What’s on your mind?",
    "What’s bothering you?",
    "What’s worrying you?",
  ]

  const { colors } = useTheme()
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.primary }]}>
        {WELCOME_HEADER[Math.floor(Math.random() * WELCOME_HEADER.length)]}
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {WELCOME_BODY[Math.floor(Math.random() * WELCOME_BODY.length)]}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
})
