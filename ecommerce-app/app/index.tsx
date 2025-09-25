import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-4">Welcome</Text>
      <Link href="/splash" asChild>
        <Text className="text-primary-500 text-lg">Go to Splash</Text>
      </Link>
    </View>
  );
}
