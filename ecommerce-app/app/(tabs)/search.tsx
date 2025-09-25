import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

// Define the product type for search results
interface SearchProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { colors } = useTheme();
  const [recentSearches, setRecentSearches] = useState([
    "MacBook",
    "Headphones",
  ]);
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]); // Add type here

  const popularProducts: SearchProduct[] = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "$999.99",
      image:
        "https://images.unsplash.com/photo-1613836255019-a7b845804788?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGlwaG9uZSUyMDV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: "$1,199.99",
      image:
        "https://images.unsplash.com/photo-1529618160092-2f8ccc8e087b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwNXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 3,
      name: "iPhone 15",
      price: "$799.99",
      image:
        "https://media.istockphoto.com/id/2193844728/photo/composite-graphics-collage-image-of-hand-hold-iphone-check-connection-wifi-high-speed-fast-5g.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZmXAR-5YOmIcdTx8wPcGS9xjc9qHFShCgLBjAwStN50=",
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simulate search results
      const results = popularProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ backgroundColor: colors.background }}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-neutral-900">
            Search Products
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center bg-neutral-100 rounded-xl px-4 py-3">
            <Ionicons name="search" size={24} color="#6C757D" />
            <TextInput
              className="flex-1 ml-3 text-lg"
              placeholder="iPhone 15"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={24} color="#6C757D" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recent Searches */}
        {searchQuery.length === 0 && recentSearches.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-semibold text-neutral-800 mb-3">
              Recent Searches
            </Text>
            <View className="flex-row flex-wrap">
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-primary-50 rounded-full px-4 py-2 mr-3 mb-3"
                  onPress={() => handleSearch(search)}
                >
                  <Text className="text-primary-600 font-medium">{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View className="px-6">
            <Text className="text-lg font-semibold text-neutral-800 mb-4">
              Search Results ({searchResults.length})
            </Text>

            {searchResults.length > 0 ? (
              <View className="space-y-4">
                {searchResults.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    className="bg-neutral-50 rounded-xl p-4 flex-row items-center"
                    activeOpacity={0.8}
                  >
                    {/* Product Image - Gray Box Area */}
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
                        {product.name}
                      </Text>
                      <Text className="text-primary-500 font-bold text-lg">
                        {product.price}
                      </Text>
                    </View>

                    {/* Add to Cart Button */}
                    <TouchableOpacity
                      className="bg-primary-500 rounded-full w-10 h-10 items-center justify-center"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-bold text-lg">+</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <Ionicons name="search-outline" size={64} color="#E9ECEF" />
                <Text className="text-neutral-500 text-lg mt-2">
                  No products found
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Popular Products (when no search) */}
        {searchQuery.length === 0 && (
          <View className="px-6">
            <Text className="text-lg font-semibold text-neutral-800 mb-4">
              Popular Products
            </Text>
            <View className="space-y-4">
              {popularProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  className="bg-neutral-50 rounded-xl p-4 flex-row items-center"
                  activeOpacity={0.8}
                  onPress={() => handleSearch(product.name)}
                >
                  {/* Product Image - Gray Box Area */}
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
                      {product.name}
                    </Text>
                    <Text className="text-primary-500 font-bold text-lg">
                      {product.price}
                    </Text>
                  </View>

                  {/* Add to Cart Button */}
                  <TouchableOpacity
                    className="bg-primary-500 rounded-full w-10 h-10 items-center justify-center"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-bold text-lg">+</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Bottom spacer for system navigation bar */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
