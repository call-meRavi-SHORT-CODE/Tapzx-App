import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "./context/AuthContext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0F172A" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="components/SignIn" />
        <Stack.Screen name="components/SignUp" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  )
}