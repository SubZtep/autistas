import { StatusBar } from "expo-status-bar"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext"
import { HomeScreen } from "./src/screens/HomeScreen"

function AppContent() {
  const { isDark } = useTheme()

  return (
    <SafeAreaProvider>
      <HomeScreen />
      <StatusBar style={isDark ? "light" : "dark"} />
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
