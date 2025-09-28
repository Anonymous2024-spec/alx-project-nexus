import React, { useEffect, useState } from "react";
import { View, Text, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Button, LoadingSpinner, Logo } from "../components/commons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push("./auth/login");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white" // Use hardcoded color
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View className="flex-1 justify-between items-center px-8 py-16">
        {/* Top Spacer */}
        <View />

        {/* Main Content - Center Area */}
        <View className="items-center">
          {/* Logo Component */}
          <View className="mb-8">
            <Logo size="large" />
          </View>

          {/* App Name */}
          <Text className="text-4xl font-bold text-center text-neutral-800 mb-4">
            ShopApp
          </Text>

          {/* Subtitle */}
          <Text className="text-xl text-center text-neutral-500 mb-12">
            Your Product Catalog
          </Text>

          {/* Loading Section */}
          <View className="items-center mb-8">
            {loading ? (
              <LoadingSpinner size="medium" color="primary" />
            ) : (
              <View className="w-16 h-1 bg-primary-500 rounded-full" />
            )}
          </View>
        </View>

        {/* Bottom Section - Get Started Button */}
        <View className="w-full">
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
