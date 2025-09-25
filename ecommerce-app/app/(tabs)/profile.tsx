import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const menuItems = [
    { icon: "heart-outline", label: "My Wishlist" },
    { icon: "settings-outline", label: "Settings" },
    { icon: "chatbubble-outline", label: "Contact Support" },
    { icon: "help-circle-outline", label: "Help & FAQ" },
    { icon: "log-out-outline", label: "Log out", isDestructive: true },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-neutral-900">Profile</Text>
        </View>

        {/* User Info Section */}
        <View className="px-6 py-8 bg-primary-50 mb-6">
          <View className="items-center">
            {/* Real User Image */}
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4 overflow-hidden">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
                onError={() => console.log("Profile image failed to load")}
              />
            </View>
            <Text className="text-2xl font-semibold text-neutral-900 mb-1">
              John Doe
            </Text>
            <Text className="text-neutral-500 text-lg">john.doe@email.com</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-5 px-6 bg-white border-b border-neutral-100"
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={28}
                color={item.isDestructive ? "#DC3545" : "#6C757D"}
                className="mr-4"
              />
              <Text
                className={`text-lg flex-1 font-medium ${
                  item.isDestructive ? "text-error" : "text-neutral-800"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacer specifically for system navigation bar */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
