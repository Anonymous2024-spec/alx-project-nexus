import React, { useState, useEffect } from "react";
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

// Redux imports
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchProducts,
  fetchCategories,
} from "@/lib/redux/slices/productSlice";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  // Redux state
  const { products, categories, loading } = useAppSelector(
    (state) => state.products
  );

  // Load data on component mount
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Load categories and featured products
        await Promise.all([
          dispatch(fetchCategories()).unwrap(),
          dispatch(fetchProducts({ limit: 20, offset: 0 })).unwrap(),
        ]);
      } catch (error) {
        console.error("Error loading home data:", error);
      }
    };

    loadHomeData();
  }, [dispatch]);

  // Create categories with icons and real data
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("electronics") || name.includes("electronic"))
      return "📱";
    if (
      name.includes("programming") ||
      name.includes("book") ||
      name.includes("tech")
    )
      return "💻";
    if (name.includes("fiction") || name.includes("literature")) return "📚";
    if (name.includes("fashion") || name.includes("clothing")) return "👕";
    if (name.includes("home") || name.includes("furniture")) return "🏠";
    if (name.includes("sports") || name.includes("fitness")) return "⚽";
    return "📦"; // Default icon
  };

  const categoriesWithIcons = categories
    .slice(0, 6)
    .map((categoryName, index) => ({
      name: categoryName,
      icon: getCategoryIcon(categoryName),
      count: products.filter((p) => p.category === categoryName).length,
      categoryId: categoryName, // Use exact API category name
      gradient: [
        "from-blue-500 to-purple-600",
        "from-pink-500 to-rose-600",
        "from-green-500 to-teal-600",
      ][index % 3],
    }));

  // Get featured products (first 4 products or those marked as featured)
  const featuredProducts = products
    .filter((product) => product.is_featured || products.indexOf(product) < 4)
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.title,
      price: product.price,
      image:
        product.image ||
        `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.title)}`,
      category: product.category,
      brand: product.brand,
    }));

  const handleCategoryPress = (categoryName: string) => {
    // Navigate to products screen with exact category name from API
    router.push({
      pathname: "/(tabs)/products",
      params: { category: categoryName },
    });
  };

  const handleProductPress = (productId: number) => {
    // Find the full product data
    const product = products.find((p) => p.id === productId);
    if (product) {
      router.push({
        pathname: `/product/[id]`,
        params: {
          id: productId.toString(),
          productData: JSON.stringify(product),
        },
      });
    }
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

            {/* Show loading or categories */}
            {loading ? (
              <View className="flex-row justify-between">
                {[1, 2, 3].map((index) => (
                  <View
                    key={index}
                    className="items-center rounded-xl p-4 flex-1 mx-1"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="w-12 h-12 rounded-full bg-gray-200 mb-3" />
                    <View className="w-16 h-4 bg-gray-200 rounded mb-1" />
                    <View className="w-12 h-3 bg-gray-200 rounded" />
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                {categoriesWithIcons.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    className="items-center rounded-xl p-4 mr-3"
                    style={{
                      backgroundColor: colors.surface,
                      minWidth: 100,
                    }}
                    activeOpacity={0.7}
                    onPress={() => handleCategoryPress(category.categoryId)}
                  >
                    <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mb-3">
                      <Text className="text-2xl">{category.icon}</Text>
                    </View>
                    <Text
                      className="text-sm font-medium text-center mb-1"
                      style={{ color: colors.text }}
                      numberOfLines={1}
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
              </ScrollView>
            )}
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

            {/* Show loading or featured products */}
            {loading ? (
              <View>
                {[1, 2].map((index) => (
                  <View
                    key={index}
                    className="rounded-xl p-4 mb-4 flex-row items-center border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    }}
                  >
                    <View className="w-20 h-20 rounded-lg bg-gray-200 mr-4" />
                    <View className="flex-1">
                      <View className="w-32 h-5 bg-gray-200 rounded mb-2" />
                      <View className="w-20 h-4 bg-gray-200 rounded" />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              featuredProducts.map((product) => (
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
                      numberOfLines={1}
                    >
                      {product.name}
                    </Text>
                    {product.brand && (
                      <Text
                        className="text-sm mb-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {product.brand}
                      </Text>
                    )}
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
              ))
            )}

            {/* Empty state */}
            {!loading && featuredProducts.length === 0 && (
              <View className="items-center py-8">
                <Ionicons
                  name="cube-outline"
                  size={48}
                  color={colors.textSecondary}
                />
                <Text className="mt-2" style={{ color: colors.textSecondary }}>
                  No featured products available
                </Text>
              </View>
            )}
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
