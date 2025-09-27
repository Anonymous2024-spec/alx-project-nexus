import { Stack } from "expo-router";
import "../global.css"; // ⚠️ CRITICAL: This import is required!
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { store, persistor } from "@/lib/redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
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
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
