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

export default function WishlistScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock wishlist data - replace with Redux later
  const mockWishlistItems = [
    {
      id: 1,
      title: 'MacBook Pro 16"',
      price: 2499.99,
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      title: "AirPods Pro",
      price: 249.99,
      image:
        "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=150&h=150&fit=crop",
    },
    {
      id: 3,
      title: "iPad Air",
      price: 599.99,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop",
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleProductPress = (productId: number) => {
    if (!isEditMode) {
      router.push(`/product/${productId}`);
    }
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    Alert.alert(
      "Remove from Wishlist",
      `Remove "${productName}" from your wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            // TODO: Connect to Redux action later
            console.log(`Remove product ${productId} from wishlist`);
          },
        },
      ]
    );
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const WishlistItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="flex-row items-center px-6 py-4 border-b"
      style={{
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }}
      onPress={() => handleProductPress(item.id)}
      activeOpacity={0.7}
    >
      {/* Product Image */}
      <View className="w-16 h-16 bg-neutral-200 rounded-lg mr-4 overflow-hidden">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      {/* Product Info */}
      <View className="flex-1">
        <Text
          className="text-base font-medium mb-1"
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="text-lg font-bold" style={{ color: colors.primary }}>
          ${item.price.toFixed(2)}
        </Text>
      </View>

      {/* Heart Icon */}
      <TouchableOpacity
        className="p-2"
        onPress={() => handleRemoveItem(item.id, item.title)}
      >
        <Ionicons name="heart" size={24} color="#FF6B35" />
      </TouchableOpacity>
    </TouchableOpacity>
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

        <Text className="text-white text-xl font-bold">My Wishlist</Text>

        <TouchableOpacity onPress={toggleEditMode}>
          <Text className="text-white text-lg font-medium">
            {isEditMode ? "Done" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Items Count */}
        <View className="px-6 py-4">
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            {mockWishlistItems.length} items in your wishlist
          </Text>
        </View>

        {/* Wishlist Items */}
        <View style={{ backgroundColor: colors.background }}>
          {mockWishlistItems.map((item) => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </View>

        {/* Bottom Tip */}
        <View className="flex-1 justify-end px-6 py-6">
          <View className="flex-row items-start">
            <Ionicons
              name="bulb-outline"
              size={16}
              color="#FFC107"
              style={{ marginTop: 2, marginRight: 8 }}
            />
            <Text
              className="text-sm leading-5 flex-1"
              style={{ color: colors.textSecondary }}
            >
              Tip: Products in your wishlist will be saved across devices
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
