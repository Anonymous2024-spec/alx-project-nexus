import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Product, ProductFilters } from "../../types/product";

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProductFilters>({
    category: null,
    priceRange: { min: 0, max: 2000 },
    sortBy: 'price_asc'
  });
  
  // Mock data using your exact Product interface
  const mockProducts: Product[] = [
    {
      id: 1,
      title: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 149.99,
      category: "electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
      rating: { rate: 4.5, count: 128 }
    },
    {
      id: 2,
      title: "Smart Watch",
      description: "Advanced smartwatch with health monitoring features",
      price: 299.99,
      category: "electronics",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
      rating: { rate: 4.3, count: 89 }
    },
    {
      id: 3,
      title: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with premium sound quality",
      price: 79.99,
      category: "electronics",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&h=150&fit=crop",
      rating: { rate: 4.7, count: 256 }
    },
    {
      id: 4,
      title: "iPhone 15 Pro",
      description: "Latest iPhone with advanced camera system",
      price: 999.99,
      category: "electronics",
      image: "https://images.unsplash.com/photo-1592899677977-9c10c23f31e1?w=150&h=150&fit=crop",
      rating: { rate: 4.8, count: 342 }
    },
    {
      id: 5,
      title: "MacBook Air M3",
      description: "Powerful and lightweight laptop for professionals",
      price: 1299.99,
      category: "electronics",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop",
      rating: { rate: 4.6, count: 167 }
    },
    // Add more products to reach 24+ as shown in Figma
    {
      id: 6,
      title: "Gaming Keyboard",
      description: "Mechanical gaming keyboard with RGB lighting",
      price: 129.99,
      category: "electronics",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop",
      rating: { rate: 4.4, count: 93 }
    }
  ];

  const filteredProducts = mockProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating': return b.rating.rate - a.rating.rate;
      case 'name': return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  const sortOptions = [
    { label: "Price ↑", value: "price_asc" as const },
    { label: "Price ↓", value: "price_desc" as const },
    { label: "Rating", value: "rating" as const },
    { label: "Name", value: "name" as const },
  ];

  const handleSortChange = () => {
    // Simple rotation through sort options
    const currentIndex = sortOptions.findIndex(opt => opt.value === filters.sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setFilters(prev => ({
      ...prev,
      sortBy: sortOptions[nextIndex].value
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-neutral-900">Products</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 pb-4">
          <View className="flex-row items-center bg-neutral-100 rounded-xl px-4 py-3">
            <Ionicons name="search" size={24} color="#6C757D" />
            <TextInput
              className="flex-1 ml-3 text-lg"
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Results Header */}
        <View className="px-6 pb-4 flex-row justify-between items-center">
          <Text className="text-neutral-600">
            {filteredProducts.length} products found
          </Text>
          
          {/* Sort Dropdown */}
          <TouchableOpacity 
            className="flex-row items-center bg-neutral-100 rounded-lg px-3 py-2"
            onPress={handleSortChange}
          >
            <Text className="text-neutral-700 mr-2">
              Sort by: {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#6C757D" />
          </TouchableOpacity>
        </View>

        {/* Products Grid */}
        <View className="px-6">
          <View className="space-y-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Product Card Component using your exact Product interface
function ProductCard({ product }: { product: Product }) {
  return (
    <TouchableOpacity 
      className="bg-neutral-50 rounded-xl p-4 flex-row items-center"
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View className="w-20 h-20 bg-neutral-200 rounded-lg items-center justify-center mr-4 overflow-hidden">
        <Image
          source={{ uri: product.image }}
          className="w-full h-full rounded-lg"
          resizeMode="cover"
          onError={() => console.log("Image failed to load")}
        />
      </View>
      
      {/* Product Info */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-neutral-900 mb-1">
          {product.title}
        </Text>
        <Text className="text-primary-500 font-bold text-lg">
          ${product.price.toFixed(2)}
        </Text>
        
        {/* Rating */}
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text className="text-neutral-600 text-sm ml-1">{product.rating.rate}</Text>
          <Text className="text-neutral-400 text-sm ml-1">({product.rating.count})</Text>
        </View>
      </View>
      
      {/* Add to Cart Button */}
      <TouchableOpacity 
        className="bg-primary-500 rounded-full w-10 h-10 items-center justify-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-lg">+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}