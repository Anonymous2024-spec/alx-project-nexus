import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Share,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/types/product";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/lib/redux/hooks";
import { CartIcon } from "@/components/commons/CartIcon";

export default function ProductDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();

  // Mock product data - in real app, you'd fetch by ID or get from route params
  // Get the actual product data
  const product: Product = params.productData
    ? JSON.parse(params.productData as string)
    : {
        id: Number(params.id) || 1,
        title: "Product not found",
        description: "This product could not be loaded",
        price: 0,
        category: "unknown",
        image: "",
        rating: { rate: 0, count: 0 },
      };

  const handleBack = () => {
    router.back();
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    Alert.alert(
      isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      isWishlisted
        ? `${product.title} has been removed from your wishlist`
        : `${product.title} has been added to your wishlist`
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      "Added to Cart",
      `${quantity} x ${product.title} added to your cart`,
      [
        { text: "Continue Shopping", style: "default" },
        {
          text: "View Cart",
          onPress: () => router.push("/cart"),
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${product.title} for $${product.price}!`,
        title: product.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
    setShowOptionsModal(false);
  };

  const handleReport = () => {
    Alert.alert(
      "Report Product",
      "Thank you for your report. We'll review this product."
    );
    setShowOptionsModal(false);
  };

  const formatBrand = (category: string) => {
    if (product.title.includes("iPhone")) return "Apple";
    if (product.title.includes("Samsung")) return "Samsung";
    if (product.title.includes("Sony")) return "Sony";
    return "Brand";
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View className="bg-primary-500 px-4 py-4 flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
          <Text className="text-white text-lg font-medium ml-1">Back</Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <CartIcon size={24} color="white" showBadge={true} />
          <TouchableOpacity
            className="p-2 ml-2"
            onPress={() => setShowOptionsModal(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Product Info & Small Image - Side by Side */}
        <View className="px-6 mt-6 flex-row">
          {/* Left Side - Product Info */}
          <View className="flex-1 pr-4">
            {/* Title */}
            <Text className="text-2xl font-bold text-neutral-900 mb-2">
              {product.title}
            </Text>

            {/* Category & Brand */}
            <Text className="text-neutral-600 text-base mb-3">
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}{" "}
              • {formatBrand(product.category)}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-4">
              <Ionicons name="star" size={20} color="#FFC107" />
              <Text className="text-neutral-700 text-base ml-2 font-medium">
                {product.rating.rate}
              </Text>
              <Text className="text-neutral-500 text-base ml-2">
                ({product.rating.count} reviews)
              </Text>
            </View>

            {/* Price */}
            <Text className="text-3xl font-bold text-primary-500">
              ${product.price.toFixed(2)}
            </Text>
          </View>

          {/* Right Side - Small Product Image */}
          <View className="w-28 h-28 bg-neutral-50 rounded-xl overflow-hidden items-center justify-center">
            <Image
              source={{ uri: product.image }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="px-6 mt-6">
          {/* Quantity Selector */}
          <View className="flex-row items-center mb-6">
            <Text className="text-lg font-medium text-neutral-900 mr-4">
              Quantity:
            </Text>
            <View className="flex-row items-center bg-neutral-100 rounded-lg">
              <TouchableOpacity className="p-3" onPress={decrementQuantity}>
                <Ionicons name="remove" size={20} color="#6C757D" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-neutral-900 mx-4 min-w-[24px] text-center">
                {quantity}
              </Text>
              <TouchableOpacity className="p-3" onPress={incrementQuantity}>
                <Ionicons name="add" size={20} color="#6C757D" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons with Proper Spacing */}
          <View className="mb-6">
            {/* Add to Wishlist */}
            <TouchableOpacity
              className={`py-4 px-6 rounded-xl flex-row justify-center items-center ${
                isWishlisted ? "bg-secondary-500" : "bg-primary-500"
              }`}
              onPress={handleWishlist}
            >
              <Ionicons
                name={isWishlisted ? "heart" : "heart-outline"}
                size={20}
                color="white"
              />
              <Text className="text-white text-lg font-semibold ml-2">
                {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
              </Text>
            </TouchableOpacity>

            {/* Spacing between buttons */}
            <View className="h-4" />

            {/* Add to Cart */}
            <TouchableOpacity
              className="py-4 px-6 rounded-xl border-2 border-primary-500 flex-row justify-center items-center"
              onPress={handleAddToCart}
            >
              <Ionicons name="bag-outline" size={20} color="#007AFF" />
              <Text className="text-primary-500 text-lg font-semibold ml-2">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-neutral-900 mb-3">
              Description
            </Text>
            <Text className="text-neutral-700 text-base leading-6">
              {product.description}
            </Text>
          </View>

          {/* Additional Features */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-neutral-900 mb-3">
              Features
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#28A745" />
                <Text className="text-neutral-700 ml-3">
                  Premium build quality
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#28A745" />
                <Text className="text-neutral-700 ml-3">
                  1-year warranty included
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#28A745" />
                <Text className="text-neutral-700 ml-3">
                  Free shipping available
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#28A745" />
                <Text className="text-neutral-700 ml-3">
                  30-day return policy
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View className="bg-white rounded-xl mx-6 w-80">
            <View className="p-4 border-b border-neutral-100">
              <Text className="text-lg font-semibold text-neutral-900">
                Product Options
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center px-4 py-4 border-b border-neutral-100"
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color="#007AFF" />
              <Text className="text-neutral-800 text-base ml-3">
                Share Product
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center px-4 py-4"
              onPress={handleReport}
            >
              <Ionicons name="flag-outline" size={20} color="#DC3545" />
              <Text className="text-neutral-800 text-base ml-3">
                Report Product
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
