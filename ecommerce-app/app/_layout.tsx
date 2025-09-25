import { Stack } from "expo-router";
import "../global.css"; // ⚠️ CRITICAL: This import is required!

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "E-Commerce App" }} />
    </Stack>
  );
}
