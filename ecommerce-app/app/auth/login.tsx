import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "../../components/commons";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/lib/redux/slices/userSlice";
import { AuthApi, ApiError } from "@/services/authApi";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters long");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await AuthApi.login({
        username: username.toLowerCase().trim(),
        password: password,
      });

      // Dispatch success action with user data
      dispatch(
        loginSuccess({
          id: response.user.id,
          email: response.user.email,
          username: response.user.username || username, // Use API username or input
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          avatar: undefined,
        })
      );

      // Success feedback
      Alert.alert(
        "Welcome Back!",
        `Hello ${response.user.first_name || "there"}! You've successfully logged in.`,
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/(tabs)/home");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error instanceof Error || (error as ApiError).message) {
        const apiError = error as ApiError;

        switch (apiError.status) {
          case 400:
            errorMessage = apiError.message || "Invalid username or password.";
            break;
          case 401:
            errorMessage =
              "Invalid username or password. Please check your credentials.";
            break;
          case 403:
            errorMessage = "Account access denied. Please contact support.";
            break;
          case 404:
            errorMessage =
              "Account not found. Please check your username or sign up.";
            break;
          case 429:
            errorMessage = "Too many login attempts. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = apiError.message || errorMessage;
        }
      } else if (error instanceof TypeError) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      dispatch(loginFailure(errorMessage));

      Alert.alert("Login Failed", errorMessage, [
        {
          text: "Try Again",
          style: "default",
        },
        {
          text: "Reset Password",
          style: "default",
          onPress: handleForgotPassword,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Password reset functionality will be implemented soon. For now, please contact support if you need help.",
      [
        { text: "OK" },
        {
          text: "Contact Support",
          onPress: () => {
            Alert.alert(
              "Support",
              "Please email support@yourapp.com for assistance."
            );
          },
        },
      ]
    );
  };

  const goToRegister = () => {
    router.push("/auth/register");
  };

  const handleQuickLogin = () => {
    if (__DEV__) {
      Alert.alert(
        "Quick Login (Dev Only)",
        "This feature is for development only. Use demo credentials?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Use Demo",
            onPress: () => {
              setUsername("testuser");
              setPassword("password123");
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        edges={["top", "left", "right"]}
      >
        <StatusBar
          barStyle={
            colors.background === "#121212" ? "light-content" : "dark-content"
          }
          backgroundColor={colors.background}
        />

        <View className="flex-1 px-6 pt-8">
          {/* Header Section */}
          <View className="items-center mb-12 mt-16">
            {/* Quick login for development */}
            {__DEV__ && (
              <TouchableOpacity onPress={handleQuickLogin} className="mb-4">
                <Text
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  [Dev] Quick Login
                </Text>
              </TouchableOpacity>
            )}

            <Text
              className="text-3xl font-bold mb-3"
              style={{ color: colors.text }}
            >
              Welcome Back
            </Text>
            <Text className="text-lg" style={{ color: colors.textSecondary }}>
              Sign in to continue shopping
            </Text>
          </View>

          {/* Login Form */}
          <View className="mb-8">
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              leftIcon="person"
              editable={!loading}
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed"
              editable={!loading}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              className="self-end mb-8"
              disabled={loading}
            >
              <Text
                className="text-base"
                style={{
                  color: loading ? colors.textSecondary : colors.primary,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading || !username || !password}
            />
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center items-center mt-auto mb-8">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={goToRegister} disabled={loading}>
              <Text
                className="text-base"
                style={{
                  color: loading ? colors.textSecondary : colors.primary,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* App Version (Development) */}
          {__DEV__ && (
            <View className="items-center mb-4">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Connected to: alx-project-nexus API
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
