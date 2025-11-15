import FontAwesome from "@expo/vector-icons/FontAwesome"
import React, { useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "../theme/ThemeContext"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [message, setMessage] = useState("")
  const [inputPlaceholder, setInputPlaceholder] = useState(getInputPlaceholder())

  const getUserMessage = () => {
    if (disabled) return ""
    let msg = message.trim()
    if (!msg && inputPlaceholder.startsWith("Try ")) {
      msg = inputPlaceholder.replace("Try ", "").slice(1, -1)
    }
    return msg
  }

  const handleSend = () => {
    const msg = getUserMessage()
    if (msg) {
      onSend(msg)
      setInputPlaceholder(getInputPlaceholder())
      setMessage("")
      Keyboard.dismiss()
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom || 8,
          },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder={inputPlaceholder}
            placeholderTextColor={colors.textTertiary}
            value={message}
            onChangeText={setMessage}
            maxLength={1000}
            editable={!disabled}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: getUserMessage() ? colors.primary : colors.border,
              },
            ]}
            onPress={handleSend}
            disabled={!getUserMessage()}
          >
            <FontAwesome name="send-o" size={24} color={getUserMessage() ? colors.surface : colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  inputContainer: {
    gap: 16,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
})

const INPUT_PLACEHOLDER = [
  "Type your message...",
  "Try “what is regression?”",
  "Try “what is autism?”",
  "Try “what is ADHD?”",
  "Try “what is hypersensitivity?”",
  "Try “what is hyposensitivity?”",
  "Try “what is sensory-seeking?”",
]

export function getInputPlaceholder() {
  return INPUT_PLACEHOLDER[Math.floor(Math.random() * INPUT_PLACEHOLDER.length)]
}
