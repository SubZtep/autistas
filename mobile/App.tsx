import * as NavigationBar from "expo-navigation-bar"
import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import { Platform } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext"
import { HomeScreen } from "./src/screens/HomeScreen"

function AppContent() {
  const { isDark } = useTheme()

  useEffect(() => {
    if (Platform.OS !== "android") {
      return
    }

    const hideSystemUI = async () => {
      await NavigationBar.setBehaviorAsync("overlay-swipe")
      await NavigationBar.setVisibilityAsync("hidden")
    }

    hideSystemUI()

    return () => {
      NavigationBar.setVisibilityAsync("visible")
    }
  }, [])

  return (
    <SafeAreaProvider>
      <HomeScreen />
      <StatusBar hidden style={isDark ? "light" : "dark"} />
    </SafeAreaProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
