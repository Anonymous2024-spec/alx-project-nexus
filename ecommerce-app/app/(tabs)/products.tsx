import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Product, ProductFilters } from "../../types/product";
import { ProductsListSkeleton } from "@/components/commons/ProductSkeleton";
import { ProductCard } from "@/components/commons/ProductCard";
import { FilterBottomSheet } from "@/components/commons/FilterBottomSheet";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProductsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    category: null,
    priceRange: { min: 0, max: 2000 },
    sortBy: "price_asc",
  });
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Mock data using your exact Product interface
  const mockProducts: Product[] = [
    {
      id: 1,
      title: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 149.99,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
      rating: { rate: 4.5, count: 128 },
    },
    {
      id: 2,
      title: "Smart Watch",
      description: "Advanced smartwatch with health monitoring features",
      price: 299.99,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
      rating: { rate: 4.3, count: 89 },
    },
    {
      id: 3,
      title: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with premium sound quality",
      price: 79.99,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&h=150&fit=crop",
      rating: { rate: 4.7, count: 256 },
    },
    {
      id: 4,
      title: "iPhone 15 Pro",
      description: "Latest iPhone with advanced camera system",
      price: 999.99,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10c23f31e1?w=150&h=150&fit=crop",
      rating: { rate: 4.8, count: 342 },
    },
    {
      id: 5,
      title: "MacBook Air M3",
      description: "Powerful and lightweight laptop for professionals",
      price: 1299.99,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop",
      rating: { rate: 4.6, count: 167 },
    },
    {
      id: 6,
      title: "Fashion Jacket",
      description: "Stylish winter jacket for modern professionals",
      price: 299.99,
      category: "fashion",
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop",
      rating: { rate: 4.4, count: 203 },
    },
    {
      id: 7,
      title: "Design Book",
      description: "Complete guide to modern UI/UX design principles",
      price: 49.99,
      category: "books",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=150&h=150&fit=crop",
      rating: { rate: 4.9, count: 95 },
    },
    {
      id: 8,
      title: "Gaming Console",
      description: "Next-gen gaming console with ultra-fast SSD",
      price: 499.99,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=150&h=150&fit=crop",
      rating: { rate: 4.7, count: 412 },
    },
    {
      id: 9,
      title: "Drone 4K",
      description: "Professional drone with 4K camera and GPS",
      price: 649.99,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=150&h=150&fit=crop",
      rating: { rate: 4.2, count: 156 },
    },
  ];

  // Simulate API loading
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProducts(mockProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Enhanced filtering logic
  const filteredProducts = products.filter((product) => {
    // Text search
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      !filters.category || product.category === filters.category;

    // Price range filter
    const matchesPrice =
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating":
        return b.rating.rate - a.rating.rate;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleApplyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleProductPress = (product: Product) => {
    // Navigate to Product Detail Screen
    router.push(`/product/${product.id}`);
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setProducts(mockProducts);
    setLoading(false);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "left", "right", "bottom"]}
      style={{ backgroundColor: colors.background }}
    >
      {/* FIXED HEADER SECTION - DOESN'T SCROLL */}
      <View className="bg-white">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-neutral-900">Products</Text>

          {/* Refresh Button */}
          <TouchableOpacity
            className="p-2"
            onPress={handleRefresh}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              size={24}
              color={loading ? "#ADB5BD" : "#007AFF"}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar - FIXED */}
        <View className="px-6 pb-4">
          <View className="flex-row items-center bg-neutral-100 rounded-xl px-4 py-3">
            <Ionicons name="search" size={24} color="#6C757D" />
            <TextInput
              className="flex-1 ml-3 text-lg"
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              editable={!loading}
            />
          </View>
        </View>

        {/* Results Header - FIXED */}
        <View className="px-6 pb-4 flex-row justify-between items-center">
          <Text className="text-neutral-600">
            {loading
              ? "Loading products..."
              : `${filteredProducts.length} products found`}
          </Text>

          {/* Filter Button */}
          <TouchableOpacity
            className={`flex-row items-center bg-neutral-100 rounded-lg px-3 py-2 ${loading ? "opacity-50" : ""}`}
            onPress={() => setShowFilterSheet(true)}
            disabled={loading}
          >
            <Ionicons name="options" size={16} color="#6C757D" />
            <Text className="text-neutral-700 ml-2">Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE PRODUCTS LIST ONLY */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Products Grid or Loading Skeleton */}
        {loading ? (
          <ProductsListSkeleton count={8} />
        ) : (
          <View className="px-6">
            <View className="space-y-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product)}
                />
              ))}

              {/* Empty State */}
              {sortedProducts.length === 0 && !loading && (
                <View className="items-center justify-center py-16">
                  <Ionicons name="search" size={64} color="#ADB5BD" />
                  <Text className="text-neutral-500 text-lg mt-4">
                    No products found
                  </Text>
                  <Text className="text-neutral-400 text-center mt-2">
                    Try adjusting your search terms or filters
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}
