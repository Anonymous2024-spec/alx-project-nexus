import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/commons/Input";
import Button from "@/components/commons/Button";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    bio: "Software developer passionate about mobile apps",
  });

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  );
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "Keep Editing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  const handleSave = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 1500);
  };

  const handleChangePhoto = async () => {
    Alert.alert("Change Profile Photo", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          // Request camera permissions
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission needed",
              "Camera permission is required to take photos"
            );
            return;
          }

          // Launch camera
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

          if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Photo Library",
        onPress: async () => {
          // Request media library permissions
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission needed",
              "Photo library permission is required to select photos"
            );
            return;
          }

          // Launch image picker
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

          if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
          onPress={handleCancel}
        >
          <Text className="text-white text-lg font-medium">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-white text-xl font-bold">Edit Profile</Text>

        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text
            className="text-white text-lg font-medium"
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Photo Section */}
        <View
          className="items-center py-8"
          style={{ backgroundColor: colors.surface }}
        >
          <TouchableOpacity onPress={handleChangePhoto}>
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4 overflow-hidden relative">
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />

              {/* Camera overlay */}
              <View className="absolute inset-0 bg-black/30 rounded-full items-center justify-center">
                <Ionicons name="camera" size={24} color="white" />
              </View>
            </View>

            <Text
              className="text-center font-medium"
              style={{ color: colors.primary }}
            >
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="px-6 pt-6">
          {/* Personal Information Section */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              Personal Information
            </Text>

            <View className="space-y-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => updateField("firstName", value)}
                placeholder="Enter your first name"
              />

              <Input
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => updateField("lastName", value)}
                placeholder="Enter your last name"
              />

              <Input
                label="Bio"
                value={formData.bio}
                onChangeText={(value) => updateField("bio", value)}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Contact Information Section */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              Contact Information
            </Text>

            <View className="space-y-4">
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField("email", value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChangeText={(value) => updateField("phone", value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Security Section */}
          <View className="mb-8">
            <Text
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              Security
            </Text>

            <TouchableOpacity
              className="flex-row items-center justify-between py-4 px-4 rounded-xl border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              onPress={() => router.push("./change-password")}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text
                  className="ml-3 text-base font-medium"
                  style={{ color: colors.text }}
                >
                  Change Password
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <Button
            title={loading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
