import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export const Logo: React.FC<LogoProps> = ({ size = "large" }) => {
  const sizes = {
    small: {
      container: 40,
      cart: 20,
      dot: 4,
    },
    medium: {
      container: 60,
      cart: 30,
      dot: 6,
    },
    large: {
      container: 80,
      cart: 40,
      dot: 8,
    },
  };

  const currentSize = sizes[size];

  return (
    <View
      className={`bg-primary-500 rounded-2xl items-center justify-center relative`}
      style={{
        width: currentSize.container,
        height: currentSize.container,
      }}
    >
      {/* Main Shopping Cart Icon */}
      <Ionicons name="storefront" size={currentSize.cart} color="white" />

      {/* Accent Dot - represents "catalog/collection" */}
      <View
        className="absolute -top-1 -right-1 bg-secondary-500 rounded-full"
        style={{
          width: currentSize.dot * 2,
          height: currentSize.dot * 2,
        }}
      />

      {/* Small product dots - represents "product catalog" */}
      <View className="absolute bottom-1 right-1 flex-row">
        <View
          className="bg-secondary-500 rounded-full mr-0.5"
          style={{
            width: currentSize.dot,
            height: currentSize.dot,
          }}
        />
        <View
          className="bg-white rounded-full"
          style={{
            width: currentSize.dot,
            height: currentSize.dot,
          }}
        />
      </View>
    </View>
  );
};

// Alternative Logo with Shopping Bag + Grid
export const LogoAlt: React.FC<LogoProps> = ({ size = "large" }) => {
  const sizes = {
    small: { container: 40, icon: 20, grid: 3 },
    medium: { container: 60, icon: 30, grid: 4 },
    large: { container: 80, icon: 40, grid: 6 },
  };

  const currentSize = sizes[size];

  return (
    <View
      className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl items-center justify-center relative"
      style={{
        width: currentSize.container,
        height: currentSize.container,
      }}
    >
      {/* Shopping Bag */}
      <Ionicons name="bag-handle" size={currentSize.icon} color="white" />

      {/* Product Grid Indicator */}
      <View className="absolute top-1 right-1">
        <View className="flex-row">
          <View
            className="bg-secondary-500 rounded-sm mr-0.5"
            style={{ width: currentSize.grid, height: currentSize.grid }}
          />
          <View
            className="bg-secondary-400 rounded-sm"
            style={{ width: currentSize.grid, height: currentSize.grid }}
          />
        </View>
        <View className="flex-row mt-0.5">
          <View
            className="bg-secondary-400 rounded-sm mr-0.5"
            style={{ width: currentSize.grid, height: currentSize.grid }}
          />
          <View
            className="bg-secondary-300 rounded-sm"
            style={{ width: currentSize.grid, height: currentSize.grid }}
          />
        </View>
      </View>
    </View>
  );
};

export default Logo;
