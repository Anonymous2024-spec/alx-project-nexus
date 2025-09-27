import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  const handleEmailPreferences = () => {
    Alert.alert("Email Preferences", "Navigate to email preferences screen");
  };

  const handlePushNotificationToggle = () => {
    setPushNotifications(!pushNotifications);
  };

  const SettingsItem = ({
    icon,
    title,
    onPress,
    showChevron = true,
    rightComponent,
  }: {
    icon: string;
    title: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className="flex-row items-center px-6 py-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={onPress}
      disabled={!onPress}
    >
      <View className="mr-4">
        <Ionicons name={icon as any} size={20} color={colors.textSecondary} />
      </View>

      <Text className="flex-1 text-base" style={{ color: colors.text }}>
        {title}
      </Text>

      {rightComponent ||
        (showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        ))}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View
      className="px-6 py-3 border-b"
      style={{ borderBottomColor: colors.border }}
    >
      <Text
        className="text-sm font-medium uppercase tracking-wide"
        style={{ color: colors.textSecondary }}
      >
        {title}
      </Text>
    </View>
  );

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

        <Text className="text-white text-xl font-bold">Settings</Text>

        {/* Placeholder for symmetry */}
        <View className="w-16" />
      </View>

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View className="mt-6">
          <SectionHeader title="Account" />

          <View style={{ backgroundColor: colors.background }}>
            <SettingsItem
              icon="person-outline"
              title="Edit Profile"
              onPress={handleEditProfile}
            />

            <SettingsItem
              icon="lock-closed-outline"
              title="Change Password"
              onPress={handleChangePassword}
            />

            <SettingsItem
              icon="mail-outline"
              title="Email Preferences"
              onPress={handleEmailPreferences}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mt-8">
          <SectionHeader title="Preferences" />

          <View style={{ backgroundColor: colors.background }}>
            <SettingsItem
              icon="notifications-outline"
              title="Push Notifications"
              showChevron={false}
              rightComponent={
                <Switch
                  value={pushNotifications}
                  onValueChange={handlePushNotificationToggle}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary + "40",
                  }}
                  thumbColor={
                    pushNotifications ? colors.primary : colors.textSecondary
                  }
                />
              }
            />

            <SettingsItem
              icon="moon-outline"
              title="Dark Mode"
              showChevron={false}
              rightComponent={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary + "40",
                  }}
                  thumbColor={
                    isDarkMode ? colors.primary : colors.textSecondary
                  }
                />
              }
            />
          </View>
        </View>

        {/* App Info Section */}
        <View className="mt-8 mb-8">
          <SectionHeader title="About" />

          <View style={{ backgroundColor: colors.background }}>
            <SettingsItem
              icon="information-circle-outline"
              title="App Version"
              showChevron={false}
              rightComponent={
                <Text style={{ color: colors.textSecondary }}>1.0.0</Text>
              }
            />

            <SettingsItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => Alert.alert("Help & Support", "Contact support")}
            />

            <SettingsItem
              icon="document-text-outline"
              title="Privacy Policy"
              onPress={() =>
                Alert.alert("Privacy Policy", "View privacy policy")
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
