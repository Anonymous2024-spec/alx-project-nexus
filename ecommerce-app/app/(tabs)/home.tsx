import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { HeaderCartIcon } from "@/components/commons/CartIcon";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { colors } = useTheme();

  // Enhanced categories data with product counts and proper navigation
  const categories = [
    {
      name: "Electronics",
      icon: "📱",
      count: 45,
      categoryId: "electronics",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      name: "Fashion",
      icon: "👕",
      count: 28,
      categoryId: "fashion",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      name: "Books",
      icon: "📚",
      count: 15,
      categoryId: "books",
      gradient: "from-green-500 to-teal-600",
    },
  ];

  // Featured products with navigation
  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999.99,
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10c23f31e1?w=400&h=300&fit=crop",
      category: "electronics",
    },
    {
      id: 2,
      name: "MacBook Air M3",
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      category: "electronics",
    },
  ];

  const handleCategoryPress = (categoryId: string) => {
    // Navigate to products screen with category filter
    router.push(`/(tabs)/products?category=${categoryId}`);
  };

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/(tabs)/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/(tabs)/search");
    }
  };

  const handleViewAllCategories = () => {
    router.push("/(tabs)/products");
  };

  const handleViewAllProducts = () => {
    router.push("/(tabs)/products");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1"
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      >
        <StatusBar
          barStyle={
            colors.background === "#121212" ? "light-content" : "dark-content"
          }
          backgroundColor={colors.primary}
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header */}
          <View
            className="px-6 pt-6 pb-4"
            style={{ backgroundColor: colors.background }}
          >
            {/* Top row with app name and cart icon */}
            <View className="flex-row justify-between items-center">
              <Text
                className="text-3xl font-bold"
                style={{ color: colors.text }}
              >
                ShopApp
              </Text>
              <HeaderCartIcon />
            </View>

            {/* Tagline below */}
            <Text className="mt-1" style={{ color: colors.textSecondary }}>
              Discover amazing products
            </Text>
          </View>

          {/* Search Bar Section */}
          <View
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            }}
          >
            <TouchableOpacity
              className="flex-row items-center px-4 py-3 rounded-xl"
              style={{ backgroundColor: colors.surface }}
              onPress={handleSearch}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={24} color={colors.textSecondary} />
              <Text
                className="flex-1 ml-3 text-lg"
                style={{
                  color: searchQuery ? colors.text : colors.textSecondary,
                }}
              >
                {searchQuery || "Search products..."}
              </Text>
              <Ionicons name="options" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Categories Section */}
          <View className="px-6 mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-xl font-semibold"
                style={{ color: colors.text }}
              >
                Categories
              </Text>
              <TouchableOpacity onPress={handleViewAllCategories}>
                <Text
                  className="text-base font-medium"
                  style={{ color: colors.primary }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between">
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  className="items-center rounded-xl p-4 flex-1 mx-1"
                  style={{ backgroundColor: colors.surface }}
                  activeOpacity={0.7}
                  onPress={() => handleCategoryPress(category.categoryId)}
                >
                  <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mb-3">
                    <Text className="text-2xl">{category.icon}</Text>
                  </View>
                  <Text
                    className="text-sm font-medium text-center mb-1"
                    style={{ color: colors.text }}
                  >
                    {category.name}
                  </Text>
                  <Text
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {category.count} items
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="px-6 mt-6">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl"
                style={{ backgroundColor: colors.surface }}
                onPress={() => router.push("/wishlist")}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text
                  className="ml-2 font-medium"
                  style={{ color: colors.text }}
                >
                  Wishlist
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl"
                style={{ backgroundColor: colors.surface }}
                onPress={() => router.push("/(tabs)/products")}
              >
                <Ionicons
                  name="grid-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text
                  className="ml-2 font-medium"
                  style={{ color: colors.text }}
                >
                  All Products
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Products Section */}
          <View className="px-6 mt-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-xl font-semibold"
                style={{ color: colors.text }}
              >
                Featured Products
              </Text>
              <TouchableOpacity onPress={handleViewAllProducts}>
                <Text
                  className="text-base font-medium"
                  style={{ color: colors.primary }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {featuredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="rounded-xl p-4 mb-4 flex-row items-center border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  shadowColor: colors.text,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.84,
                  elevation: 3,
                }}
                activeOpacity={0.8}
                onPress={() => handleProductPress(product.id)}
              >
                {/* Product Image */}
                <View className="w-20 h-20 rounded-lg items-center justify-center mr-4 overflow-hidden">
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                    onError={() =>
                      console.log("Image failed to load:", product.image)
                    }
                  />
                </View>

                {/* Product Information */}
                <View className="flex-1">
                  <Text
                    className="text-lg font-semibold mb-1"
                    style={{ color: colors.text }}
                  >
                    {product.name}
                  </Text>
                  <Text
                    className="font-bold text-lg"
                    style={{ color: colors.primary }}
                  >
                    ${product.price.toFixed(2)}
                  </Text>
                </View>

                {/* Add to Wishlist Button */}
                <TouchableOpacity
                  className="rounded-full w-10 h-10 items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent product navigation
                    console.log("Add to wishlist:", product.id);
                  }}
                >
                  <Ionicons name="heart-outline" size={18} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Promotional Banner */}
          <View className="px-6 mt-6">
            <TouchableOpacity
              className="rounded-xl p-6 items-center"
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-bold mb-2">
                Special Offers
              </Text>
              <Text className="text-white text-center">
                Get up to 50% off on selected items
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
