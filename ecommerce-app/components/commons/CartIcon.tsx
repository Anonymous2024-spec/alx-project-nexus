import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";

interface CartIconProps {
  size?: number;
  color?: string;
  showBadge?: boolean;
}

export const CartIcon: React.FC<CartIconProps> = ({
  size = 24,
  color,
  showBadge = true,
}) => {
  const router = useRouter();
  const { getCartItemCount } = useCart();
  const { colors } = useTheme();

  const itemCount = getCartItemCount();
  const iconColor = color || colors.text;

  const handlePress = () => {
    router.push("/cart");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="relative p-2"
      activeOpacity={0.7}
    >
      <Ionicons name="bag-outline" size={size} color={iconColor} />

      {showBadge && itemCount > 0 && (
        <View
          className="absolute -top-1 -right-1 rounded-full min-w-[18px] h-[18px] items-center justify-center"
          style={{ backgroundColor: colors.secondary }}
        >
          <Text className="text-white text-xs font-bold">
            {itemCount > 99 ? "99+" : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Header Cart Icon - for use in screen headers
export const HeaderCartIcon: React.FC = () => {
  const { colors } = useTheme();

  return <CartIcon size={24} color={colors.text} showBadge={true} />;
};

export default CartIcon;
