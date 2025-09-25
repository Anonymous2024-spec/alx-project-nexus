import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "../../components/commons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Login successful!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") },
      ]);
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be implemented soon."
    );
  };

  const goToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <SafeAreaProvider>
      {" "}
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View className="flex-1 px-6 pt-8">
          {/* Header Section */}
          <View className="items-center mb-12 mt-16">
            <Text className="text-3xl font-bold text-neutral-800 mb-3">
              Welcome Back
            </Text>
            <Text className="text-lg text-neutral-500">
              Sign in to continue
            </Text>
          </View>

          {/* Login Form */}
          <View className="mb-8">
            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed"
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              className="self-end mb-8"
            >
              <Text className="text-primary-500 text-base">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            />
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center items-center mt-auto mb-8">
            <Text className="text-neutral-600 text-base">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text className="text-primary-500 text-base">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
