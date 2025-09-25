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
import { SearchBar } from "../../components/commons";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { colors } = useTheme();

  // Categories data with icons
  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Fashion", icon: "👕" },
    { name: "Books", icon: "📚" },
  ];

  // Featured products with actual images
  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "$990.99",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10c23f31e1?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "MacBook Air M3",
      price: "$1,299.99",
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* White Header with App Name */}
          <View className="bg-white px-6 pt-6 pb-4">
            <Text className="text-3xl font-bold text-neutral-900">ShopApp</Text>
            <Text className="text-neutral-500 mt-1">
              Discover amazing products
            </Text>
          </View>

          {/* Search Bar Section */}
          <View className="px-4 py-4 bg-white border-b border-neutral-100">
            <SearchBar
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={(query) => console.log("Search:", query)}
              style="default"
              showFilterButton={false}
            />
          </View>

          {/* Categories Section */}
          <View className="px-6 mt-6">
            <Text className="text-xl font-semibold text-neutral-800 mb-4">
              Categories
            </Text>
            <View className="flex-row justify-between">
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  className="items-center bg-primary-50 rounded-xl p-4 flex-1 mx-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-2xl mb-2">{category.icon}</Text>
                  <Text className="text-sm font-medium text-primary-600 text-center">
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Featured Products Section */}
          <View className="px-6 mt-8">
            <Text className="text-xl font-semibold text-neutral-800 mb-4">
              Featured Products
            </Text>

            {featuredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="bg-neutral-50 rounded-xl p-4 mb-4 flex-row items-center"
                activeOpacity={0.8}
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.84,
                  elevation: 3,
                }}
              >
                {/* Product Image */}
                <View className="w-20 h-20 bg-neutral-200 rounded-lg items-center justify-center mr-4">
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
                  <Text className="text-lg font-semibold text-neutral-900 mb-1">
                    {product.name}
                  </Text>
                  <Text className="text-primary-500 font-bold text-lg">
                    {product.price}
                  </Text>
                </View>

                {/* Add to Cart Button */}
                <TouchableOpacity
                  className="bg-primary-500 rounded-full w-10 h-10 items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-lg">+</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
