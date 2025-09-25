import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  variant?: "default" | "compact" | "featured";
  showChevron?: boolean;
}

export function ProductCard({
  product,
  onPress,
  variant = "default",
  showChevron = true,
}: ProductCardProps) {
  const getCardStyles = () => {
    switch (variant) {
      case "compact":
        return {
          container: "bg-neutral-50 rounded-lg p-3 flex-row items-center",
          image: "w-16 h-16",
          title: "text-base font-medium text-neutral-900 mb-1",
          price: "text-primary-500 font-semibold text-base",
        };
      case "featured":
        return {
          container:
            "bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-neutral-100",
          image: "w-24 h-24",
          title: "text-xl font-bold text-neutral-900 mb-1",
          price: "text-primary-500 font-bold text-xl",
        };
      default:
        return {
          container: "bg-neutral-50 rounded-xl p-4 flex-row items-center",
          image: "w-20 h-20",
          title: "text-lg font-semibold text-neutral-900 mb-1",
          price: "text-primary-500 font-bold text-lg",
        };
    }
  };

  const styles = getCardStyles();

  return (
    <TouchableOpacity
      className={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Product Image */}
      <View
        className={`${styles.image} bg-neutral-200 rounded-lg items-center justify-center mr-4 overflow-hidden`}
      >
        <Image
          source={{ uri: product.image }}
          className="w-full h-full rounded-lg"
          resizeMode="cover"
          onError={() => console.log("Image failed to load:", product.title)}
        />
      </View>

      {/* Product Info */}
      <View className="flex-1">
        <Text className={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text className={styles.price}>${product.price.toFixed(2)}</Text>

        {/* Rating */}
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text className="text-neutral-600 text-sm ml-1">
            {product.rating.rate}
          </Text>
          <Text className="text-neutral-400 text-sm ml-1">
            ({product.rating.count})
          </Text>
        </View>

        {/* Category Badge - Only show in featured variant */}
        {variant === "featured" && (
          <View className="mt-2">
            <View className="bg-primary-100 px-2 py-1 rounded-full self-start">
              <Text className="text-primary-600 text-xs font-medium capitalize">
                {product.category}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Chevron for navigation indication */}
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#6C757D" />
      )}
    </TouchableOpacity>
  );
}

export default ProductCard;
