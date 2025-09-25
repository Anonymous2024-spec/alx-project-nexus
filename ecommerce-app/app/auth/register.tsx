import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "../../components/commons";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") },
      ]);
    }, 1500);
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View className="flex-1 px-6 pt-8">
          {/* Header Section */}
          <View className="items-center mb-12 mt-16">
            <Text className="text-3xl font-bold text-neutral-800 mb-3">
              Create Account
            </Text>
            <Text className="text-lg text-neutral-500">Join us today</Text>
          </View>

          {/* Registration Form */}
          <View className="mb-8">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              leftIcon="person"
            />

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

            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon="lock-closed"
              error={
                confirmPassword && password !== confirmPassword
                  ? "Passwords don't match"
                  : undefined
              }
            />

            {/* Register Button */}
            <View className="mt-4">
              <Button
                title="Create Account"
                onPress={handleRegister}
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
              />
            </View>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center items-center mt-auto mb-8">
            <Text className="text-neutral-600 text-base">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text className="text-primary-500 text-base">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
