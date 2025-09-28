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

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"consumer" | "seller">("consumer");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "Please enter your first name");
      return false;
    }

    if (!lastName.trim()) {
      Alert.alert("Error", "Please enter your last name");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (!password) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      Alert.alert(
        "Weak Password",
        "Password should contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    }

    if (!confirmPassword) {
      Alert.alert("Error", "Please confirm your password");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Register the user
      const registerResponse = await AuthApi.register({
        email: email.toLowerCase().trim(),
        password: password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        user_type: userType,
      });

      // Registration successful
      Alert.alert(
        "Registration Successful!",
        `Welcome ${firstName}! Your account has been created successfully. Please check your email for verification instructions.`,
        [
          {
            text: "Sign In Now",
            onPress: async () => {
              // Attempt auto-login after registration
              try {
                dispatch(loginStart());

                const loginResponse = await AuthApi.login({
                  email: email.toLowerCase().trim(),
                  password: password,
                });

                dispatch(
                  loginSuccess({
                    id: loginResponse.user.id,
                    email: loginResponse.user.email,
                    username: loginResponse.user.email,
                    firstName: loginResponse.user.first_name,
                    lastName: loginResponse.user.last_name,
                    avatar: undefined,
                  })
                );

                // Navigate to home
                router.replace("/(tabs)/home");
              } catch (loginError) {
                console.error(
                  "Auto-login after registration failed:",
                  loginError
                );
                dispatch(
                  loginFailure("Registration successful, but auto-login failed")
                );

                // Navigate to login screen instead
                Alert.alert(
                  "Please Sign In",
                  "Your account was created successfully. Please sign in with your credentials.",
                  [
                    {
                      text: "Go to Sign In",
                      onPress: () => router.replace("/auth/login"),
                    },
                  ]
                );
              }
            },
          },
          {
            text: "Sign In Later",
            style: "cancel",
            onPress: () => router.replace("/auth/login"),
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error instanceof Error || (error as ApiError).message) {
        const apiError = error as ApiError;

        switch (apiError.status) {
          case 400:
            // Handle field-specific errors
            if (apiError.details) {
              if (apiError.details.email) {
                errorMessage = Array.isArray(apiError.details.email)
                  ? apiError.details.email[0]
                  : "This email is already registered.";
              } else if (apiError.details.password) {
                errorMessage = Array.isArray(apiError.details.password)
                  ? apiError.details.password[0]
                  : "Password requirements not met.";
              } else {
                errorMessage =
                  apiError.message ||
                  "Please check your information and try again.";
              }
            } else {
              errorMessage = apiError.message || "Invalid registration data.";
            }
            break;
          case 409:
            errorMessage =
              "An account with this email already exists. Please try signing in instead.";
            break;
          case 429:
            errorMessage =
              "Too many registration attempts. Please try again later.";
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

      Alert.alert("Registration Failed", errorMessage, [
        {
          text: "Try Again",
          style: "default",
        },
        {
          text: "Sign In Instead",
          style: "default",
          onPress: () => router.push("/auth/login"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.back();
  };

  const handleQuickFill = () => {
    // Development helper - remove in production
    if (__DEV__) {
      Alert.alert("Quick Fill (Dev Only)", "Fill with test data?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Fill Form",
          onPress: () => {
            setFirstName("John");
            setLastName("Doe");
            setEmail("john.doe@example.com");
            setPassword("TestPass123");
            setConfirmPassword("TestPass123");
          },
        },
      ]);
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
          <View className="items-center mb-12 mt-8">
            {/* Quick fill for development */}
            {__DEV__ && (
              <TouchableOpacity onPress={handleQuickFill} className="mb-4">
                <Text
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  [Dev] Quick Fill
                </Text>
              </TouchableOpacity>
            )}

            <Text
              className="text-3xl font-bold mb-3"
              style={{ color: colors.text }}
            >
              Create Account
            </Text>
            <Text className="text-lg" style={{ color: colors.textSecondary }}>
              Join us and start shopping
            </Text>
          </View>

          {/* Registration Form */}
          <View className="mb-8">
            {/* Name Fields */}
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  leftIcon="person"
                  editable={!loading}
                />
              </View>
              <View className="flex-1">
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  leftIcon="person"
                  editable={!loading}
                />
              </View>
            </View>

            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              editable={!loading}
            />

            {/* User Type Selection */}
            <View className="mb-4">
              <Text
                className="text-base font-medium mb-3"
                style={{ color: colors.text }}
              >
                Account Type
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl border-2 ${
                    userType === "consumer"
                      ? "border-primary-500"
                      : "border-neutral-200"
                  }`}
                  style={{
                    backgroundColor:
                      userType === "consumer"
                        ? colors.primary + "10"
                        : colors.surface,
                  }}
                  onPress={() => setUserType("consumer")}
                  disabled={loading}
                >
                  <Text
                    className={`text-center font-medium ${
                      userType === "consumer"
                        ? "text-primary-500"
                        : "text-neutral-600"
                    }`}
                    style={{
                      color:
                        userType === "consumer"
                          ? colors.primary
                          : colors.textSecondary,
                    }}
                  >
                    Shopper
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl border-2 ${
                    userType === "seller"
                      ? "border-primary-500"
                      : "border-neutral-200"
                  }`}
                  style={{
                    backgroundColor:
                      userType === "seller"
                        ? colors.primary + "10"
                        : colors.surface,
                  }}
                  onPress={() => setUserType("seller")}
                  disabled={loading}
                >
                  <Text
                    className={`text-center font-medium ${
                      userType === "seller"
                        ? "text-primary-500"
                        : "text-neutral-600"
                    }`}
                    style={{
                      color:
                        userType === "seller"
                          ? colors.primary
                          : colors.textSecondary,
                    }}
                  >
                    Seller
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Input
              placeholder="Password (min. 8 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed"
              editable={!loading}
            />

            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon="lock-closed"
              editable={!loading}
              error={
                confirmPassword && password !== confirmPassword
                  ? "Passwords don't match"
                  : undefined
              }
            />

            {/* Password Requirements */}
            {password.length > 0 && (
              <View
                className="p-3 rounded-lg mb-4"
                style={{ backgroundColor: colors.surface }}
              >
                <Text
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Password Requirements:
                </Text>
                <View className="space-y-1">
                  <Text
                    className={`text-xs ${password.length >= 8 ? "text-green-600" : "text-neutral-500"}`}
                  >
                    • At least 8 characters {password.length >= 8 ? "✓" : ""}
                  </Text>
                  <Text
                    className={`text-xs ${/[A-Z]/.test(password) ? "text-green-600" : "text-neutral-500"}`}
                  >
                    • One uppercase letter {/[A-Z]/.test(password) ? "✓" : ""}
                  </Text>
                  <Text
                    className={`text-xs ${/[a-z]/.test(password) ? "text-green-600" : "text-neutral-500"}`}
                  >
                    • One lowercase letter {/[a-z]/.test(password) ? "✓" : ""}
                  </Text>
                  <Text
                    className={`text-xs ${/\d/.test(password) ? "text-green-600" : "text-neutral-500"}`}
                  >
                    • One number {/\d/.test(password) ? "✓" : ""}
                  </Text>
                </View>
              </View>
            )}

            {/* Register Button */}
            <View className="mt-4">
              <Button
                title={loading ? "Creating Account..." : "Create Account"}
                onPress={handleRegister}
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                disabled={
                  loading ||
                  !firstName ||
                  !lastName ||
                  !email ||
                  !password ||
                  !confirmPassword
                }
              />
            </View>
          </View>

          {/* Terms and Privacy */}
          <View className="items-center mb-6">
            <Text
              className="text-sm text-center leading-5"
              style={{ color: colors.textSecondary }}
            >
              By creating an account, you agree to our{"\n"}
              <Text style={{ color: colors.primary }}>
                Terms of Service
              </Text>{" "}
              and <Text style={{ color: colors.primary }}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={goToLogin} disabled={loading}>
              <Text
                className="text-base"
                style={{
                  color: loading ? colors.textSecondary : colors.primary,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* API Status (Development) */}
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
