import React from "react";
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
import { useCart, CartItem } from "@/contexts/CartContext";
import Button from "@/components/commons/Button";

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();

  const handleBack = () => {
    router.back();
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (!item) return;

    Alert.alert(
      "Remove Item",
      `Remove "${item.product.title}" from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearCart,
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    Alert.alert(
      "Checkout",
      `Proceed to checkout with ${getCartItemCount()} items for $${getCartTotal().toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Checkout",
          onPress: () => {
            // TODO: Navigate to checkout screen
            console.log("Navigate to checkout");
          },
        },
      ]
    );
  };

  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <View
      className="flex-row items-center p-4 border-b"
      style={{
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }}
    >
      {/* Product Image */}
      <View className="w-20 h-20 rounded-lg mr-4 overflow-hidden">
        <Image
          source={{ uri: item.product.image }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      {/* Product Info */}
      <View className="flex-1">
        <Text
          className="text-lg font-medium mb-1"
          style={{ color: colors.text }}
          numberOfLines={2}
        >
          {item.product.title}
        </Text>

        <Text
          className="text-base font-bold mb-2"
          style={{ color: colors.primary }}
        >
          ${item.product.price.toFixed(2)}
        </Text>

        {/* Quantity Controls */}
        <View className="flex-row items-center">
          <TouchableOpacity
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.surface }}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity - 1)
            }
          >
            <Ionicons name="remove" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text
            className="mx-4 text-lg font-semibold min-w-[32px] text-center"
            style={{ color: colors.text }}
          >
            {item.quantity}
          </Text>

          <TouchableOpacity
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.surface }}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity + 1)
            }
          >
            <Ionicons name="add" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        className="p-2 ml-2"
        onPress={() => handleRemoveItem(item.product.id)}
      >
        <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
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

        <Text className="text-white text-xl font-bold">Shopping Cart</Text>

        <TouchableOpacity onPress={handleClearCart}>
          <Text className="text-white text-lg font-medium">Clear</Text>
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="bag-outline" size={80} color={colors.textSecondary} />
          <Text
            className="text-2xl font-bold mt-6 mb-2"
            style={{ color: colors.text }}
          >
            Your cart is empty
          </Text>
          <Text
            className="text-center text-base leading-6 mb-8"
            style={{ color: colors.textSecondary }}
          >
            Add some products to your cart to get started with your shopping
            experience
          </Text>

          <Button
            title="Continue Shopping"
            onPress={() => router.push("/(tabs)/products")}
          />
        </View>
      ) : (
        // Cart with Items
        <View className="flex-1">
          {/* Items Count */}
          <View className="px-6 py-4">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              {getCartItemCount()} items in your cart
            </Text>
          </View>

          {/* Cart Items */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {cartItems.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </ScrollView>

          {/* Cart Summary */}
          <View
            className="px-6 py-4 border-t"
            style={{
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            }}
          >
            {/* Subtotal */}
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-medium"
                style={{ color: colors.text }}
              >
                Subtotal ({getCartItemCount()} items)
              </Text>
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
                ${getCartTotal().toFixed(2)}
              </Text>
            </View>

            {/* Checkout Button */}
            <Button
              title={`Checkout - $${getCartTotal().toFixed(2)}`}
              onPress={handleCheckout}
            />

            {/* Continue Shopping Link */}
            <TouchableOpacity
              className="mt-4 py-2"
              onPress={() => router.push("/(tabs)/products")}
            >
              <Text
                className="text-center font-medium"
                style={{ color: colors.primary }}
              >
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
