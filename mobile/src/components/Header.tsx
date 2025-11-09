import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          paddingTop: insets.top,
          borderBottomColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Hamburger menu placeholder */}
        <TouchableOpacity style={styles.menuButton} onPress={() => {}}>
          <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
        </TouchableOpacity>

        {/* App title */}
        <Text style={[styles.title, { color: colors.primary }]}>Autistas</Text>

        {/* Placeholder for future actions */}
        <View style={styles.menuButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLine: {
    width: 24,
    height: 2.5,
    borderRadius: 2,
    marginVertical: 2.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
