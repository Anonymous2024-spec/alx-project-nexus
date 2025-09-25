import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

// Individual Product Card Skeleton
export function ProductCardSkeleton() {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const shimmerOpacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View className="bg-neutral-50 rounded-xl p-4 flex-row items-center">
      {/* Product Image Skeleton */}
      <Animated.View
        className="w-20 h-20 bg-neutral-200 rounded-lg mr-4"
        style={{ opacity: shimmerOpacity }}
      />

      {/* Product Info Skeleton */}
      <View className="flex-1">
        {/* Title Skeleton */}
        <Animated.View
          className="h-5 bg-neutral-200 rounded mb-2"
          style={{
            opacity: shimmerOpacity,
            width: "80%",
          }}
        />

        {/* Price Skeleton */}
        <Animated.View
          className="h-5 bg-neutral-200 rounded mb-2"
          style={{
            opacity: shimmerOpacity,
            width: "40%",
          }}
        />

        {/* Rating Skeleton */}
        <View className="flex-row items-center mt-1">
          <Animated.View
            className="w-4 h-4 bg-neutral-200 rounded mr-1"
            style={{ opacity: shimmerOpacity }}
          />
          <Animated.View
            className="h-3 bg-neutral-200 rounded"
            style={{
              opacity: shimmerOpacity,
              width: 60,
            }}
          />
        </View>
      </View>

      {/* Chevron Skeleton */}
      <Animated.View
        className="w-5 h-5 bg-neutral-200 rounded"
        style={{ opacity: shimmerOpacity }}
      />
    </View>
  );
}

// Products List Skeleton (shows multiple skeleton cards)
export function ProductsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View className="px-6">
      <View className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </View>
    </View>
  );
}
