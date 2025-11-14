import React, { useMemo, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getInputPlaceholder } from "../config/msg"
import { useTheme } from "../contexts/ThemeContext"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [message, setMessage] = useState("")
  const inputPlaceholder = useMemo(() => getInputPlaceholder(), [])

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
            <View style={styles.sendIcon}>
              <View
                style={[
                  styles.sendTriangle,
                  {
                    borderLeftColor: getUserMessage() ? colors.surface : colors.textTertiary,
                  },
                ]}
              />
            </View>
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
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    height: 66,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 14,
    borderRightWidth: 0,
    borderBottomWidth: 7,
    borderTopWidth: 7,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginLeft: 2,
  },
})
