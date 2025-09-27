import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/commons/Input";
import Button from "@/components/commons/Button";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePasswords = () => {
    if (!formData.currentPassword) {
      Alert.alert("Validation Error", "Please enter your current password");
      return false;
    }

    if (!formData.newPassword) {
      Alert.alert("Validation Error", "Please enter a new password");
      return false;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert(
        "Validation Error",
        "New password must be at least 6 characters long"
      );
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Validation Error", "New passwords do not match");
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert(
        "Validation Error",
        "New password must be different from current password"
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validatePasswords()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Password Changed",
        "Your password has been changed successfully",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear form and go back
              setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              router.back();
            },
          },
        ]
      );
    }, 2000);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Weak", color: "#DC3545" };
    if (password.length < 10) return { label: "Medium", color: "#FFC107" };
    return { label: "Strong", color: "#28A745" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View
        className="px-4 py-4 flex-row justify-between items-center"
        style={{ backgroundColor: colors.primary }}
      >
        <TouchableOpacity
          className="flex-row items-center"
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
          <Text className="text-white text-lg font-medium ml-1">Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-xl font-bold">Change Password</Text>

        {/* Placeholder for symmetry */}
        <View className="w-16" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-6 pt-8">
          {/* Instructions */}
          <View className="mb-8">
            <Text
              className="text-base leading-6"
              style={{ color: colors.textSecondary }}
            >
              For your security, please enter your current password and choose a
              new password.
            </Text>
          </View>

          {/* Current Password */}
          <View className="mb-6">
            <View className="relative">
              <Input
                label="Current Password"
                value={formData.currentPassword}
                onChangeText={(value: string) =>
                  updateField("currentPassword", value)
                }
                placeholder="Enter your current password"
                secureTextEntry={!showPasswords.current}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-9 p-2"
              >
                <Ionicons
                  name={showPasswords.current ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <View className="relative">
              <Input
                label="New Password"
                value={formData.newPassword}
                onChangeText={(value: string) =>
                  updateField("newPassword", value)
                }
                placeholder="Enter your new password"
                secureTextEntry={!showPasswords.new}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-9 p-2"
              >
                <Ionicons
                  name={showPasswords.new ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {passwordStrength && (
              <View className="mt-2">
                <Text
                  className="text-sm font-medium"
                  style={{ color: passwordStrength.color }}
                >
                  Password strength: {passwordStrength.label}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm New Password */}
          <View className="mb-6">
            <View className="relative">
              <Input
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChangeText={(value: string) =>
                  updateField("confirmPassword", value)
                }
                placeholder="Confirm your new password"
                secureTextEntry={!showPasswords.confirm}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-9 p-2"
              >
                <Ionicons
                  name={showPasswords.confirm ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Match Indicator */}
            {formData.confirmPassword.length > 0 && (
              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name={
                    formData.newPassword === formData.confirmPassword
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={16}
                  color={
                    formData.newPassword === formData.confirmPassword
                      ? "#28A745"
                      : "#DC3545"
                  }
                />
                <Text
                  className="text-sm ml-1"
                  style={{
                    color:
                      formData.newPassword === formData.confirmPassword
                        ? "#28A745"
                        : "#DC3545",
                  }}
                >
                  {formData.newPassword === formData.confirmPassword
                    ? "Passwords match"
                    : "Passwords don't match"}
                </Text>
              </View>
            )}
          </View>

          {/* Password Requirements */}
          <View
            className="mb-8 p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="text-base font-medium mb-3"
              style={{ color: colors.text }}
            >
              Password Requirements:
            </Text>

            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    formData.newPassword.length >= 6
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    formData.newPassword.length >= 6
                      ? "#28A745"
                      : colors.textSecondary
                  }
                />
                <Text
                  className="text-sm ml-2"
                  style={{ color: colors.textSecondary }}
                >
                  At least 6 characters
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons
                  name={
                    formData.newPassword !== formData.currentPassword &&
                    formData.newPassword.length > 0
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    formData.newPassword !== formData.currentPassword &&
                    formData.newPassword.length > 0
                      ? "#28A745"
                      : colors.textSecondary
                  }
                />
                <Text
                  className="text-sm ml-2"
                  style={{ color: colors.textSecondary }}
                >
                  Different from current password
                </Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Button
            title={loading ? "Changing Password..." : "Change Password"}
            onPress={handleSave}
            disabled={
              loading ||
              !formData.currentPassword ||
              !formData.newPassword ||
              !formData.confirmPassword
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
