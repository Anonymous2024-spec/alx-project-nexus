import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Product, ProductFilters } from "../../types/product";
import { ProductsListSkeleton } from "@/components/commons/ProductSkeleton";
import { ProductCard } from "@/components/commons/ProductCard";
import { FilterBottomSheet } from "@/components/commons/FilterBottomSheet";
import SearchBar from "@/components/commons/SearchBar";
import { useTheme } from "@/contexts/ThemeContext";
import { HeaderCartIcon } from "@/components/commons/CartIcon";

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Initialize filters with category from URL parameter
  const [filters, setFilters] = useState<ProductFilters>({
    category: (params.category as string) || null,
    priceRange: { min: 0, max: 2000 },
    sortBy: "price_asc",
  });

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

  // Update filters when URL parameters change
  useEffect(() => {
    if (params.category) {
      setFilters((prev) => ({
        ...prev,
        category: params.category as string,
      }));
    }
    if (params.q) {
      setSearchQuery(params.q as string);
    }
  }, [params]);

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
    router.push(`/product/${product.id}`);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setProducts(mockProducts);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearCategoryFilter = () => {
    setFilters((prev) => ({ ...prev, category: null }));
    // Update URL to remove category parameter
    router.replace("/(tabs)/products");
  };

  const getCategoryDisplayName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right", "bottom"]}
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          Products
        </Text>

        {/* Right side icons */}
        <View className="flex-row items-center">
          <HeaderCartIcon />

          <TouchableOpacity
            className="p-2 ml-2"
            onPress={handleRefresh}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              size={24}
              color={loading ? colors.textSecondary : colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE PRODUCTS LIST */}
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
                  <Ionicons
                    name="search"
                    size={64}
                    color={colors.textSecondary}
                  />
                  <Text
                    className="text-lg mt-4"
                    style={{ color: colors.textSecondary }}
                  >
                    No products found
                  </Text>
                  <Text
                    className="text-center mt-2"
                    style={{ color: colors.textSecondary }}
                  >
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
