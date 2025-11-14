/* eslint-env node */
export default {
  expo: {
    name: "Autistas",
    slug: "autistas",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/appicon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.subztep.autistas",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.subztep.autistas",
    },
    web: {
      favicon: "./assets/appicon.png",
    },
    extra: {
      eas: {
        projectId: "51a3b751-1a47-46a9-a833-881f1269be77",
      },
      // eslint-disable-next-line no-undef
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
    },
    plugins: [
      [
        "expo-dev-client",
        {
          launchMode: "most-recent",
        },
      ],
    ],
  },
}
