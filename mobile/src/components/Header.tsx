import Ionicons from "@expo/vector-icons/Ionicons"
import Constants from "expo-constants"
import React, { useState } from "react"
import { Button, Linking, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "../theme/ThemeContext"

export const Header = () => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)
  const version = Constants.expoConfig?.version ?? "0.0.0"

  return (
    <>
      <View
        style={[
          styles.floatingButton,
          {
            top: insets.top + 12,
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
            borderColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Ionicons name="extension-puzzle-outline" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setMenuVisible(false)} />
          <View
            style={[
              styles.menu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.primary }]}>Autistas</Text>
            <Text style={[styles.version, { color: colors.textTertiary }]}>Version {version}</Text>
            <TouchableOpacity
              disabled
              onPress={() => {}}
              style={[styles.loginButton, { backgroundColor: colors.primary, opacity: 0.2 }]}
            >
              <Text style={[styles.loginText, { color: colors.surface }]}>Log in</Text>
            </TouchableOpacity>

            <Button
              title="Visit GitHub for details"
              color={colors.info}
              onPress={() => Linking.openURL("https://github.com/SubZtep/autistas")}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    left: 16,
    borderWidth: 1,
    borderRadius: 24,
    padding: 8,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  menu: {
    width: 260,
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  version: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
  },
})
