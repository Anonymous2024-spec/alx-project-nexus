import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
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

// Redux imports
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchProducts,
  fetchCategories,
  setSearchQuery as setReduxSearchQuery,
  setFilters as setReduxFilters,
  clearFilters,
  clearError,
} from "@/lib/redux/slices/productSlice";

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  // Redux state
  const {
    products,
    categories,
    loading,
    error,
    filters: reduxFilters,
    searchQuery: reduxSearchQuery,
  } = useAppSelector((state) => state.products);

  // Local state
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // SIMPLIFIED: Handle params and fetch data in one effect
  useEffect(() => {
    const handleParamsAndFetch = async () => {
      console.log("📥 Params received:", params);

      try {
        dispatch(clearError());

        // Set filters from params
        const newFilters: ProductFilters = {
          category: (params.category as string) || null,
          priceRange: { min: 0, max: 2000 },
          sortBy: "name",
        };

        console.log("🎛️ Setting filters:", newFilters);
        dispatch(setReduxFilters(newFilters));

        // Set search from params
        if (params.q) {
          const query = params.q as string;
          setLocalSearchQuery(query);
          dispatch(setReduxSearchQuery(query));
        }

        // Fetch categories
        await dispatch(fetchCategories()).unwrap();

        // Fetch products with filters
        console.log("🌐 Fetching products with:", {
          category: newFilters.category,
          search: params.q as string,
        });

        await dispatch(
          fetchProducts({
            limit: 20,
            offset: 0,
            category: newFilters.category || undefined,
            search: (params.q as string) || undefined,
          })
        ).unwrap();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    handleParamsAndFetch();
  }, [params.category, params.q, dispatch]);

  // Fetch when redux filters change (from filter sheet)
  useEffect(() => {
    const fetchWithCurrentFilters = async () => {
      // Skip if this is the initial load (handled above)
      if (!reduxFilters.category && !reduxSearchQuery) return;

      console.log("🔄 Filters changed, fetching:", {
        category: reduxFilters.category,
        search: reduxSearchQuery,
      });

      try {
        await dispatch(
          fetchProducts({
            limit: 20,
            offset: 0,
            category: reduxFilters.category || undefined,
            search: reduxSearchQuery || undefined,
          })
        ).unwrap();
      } catch (error) {
        console.error("Error fetching with filters:", error);
      }
    };

    // Debounce the fetch
    const timeoutId = setTimeout(fetchWithCurrentFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [reduxFilters.category, reduxSearchQuery, dispatch]);

  // Apply local filtering and sorting
  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      product.price >= reduxFilters.priceRange.min &&
      product.price <= reduxFilters.priceRange.max;
    return matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (reduxFilters.sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating":
        return b.rating.rate - a.rating.rate;
      case "name":
        return a.title.localeCompare(b.title);
      case "newest":
        if (a.created_at && b.created_at) {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      dispatch(clearError());

      await Promise.all([
        dispatch(fetchCategories()).unwrap(),
        dispatch(
          fetchProducts({
            limit: 20,
            offset: 0,
            category: reduxFilters.category || undefined,
            search: reduxSearchQuery || undefined,
          })
        ).unwrap(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleApplyFilters = useCallback(
    (newFilters: ProductFilters) => {
      dispatch(setReduxFilters(newFilters));
      setShowFilterSheet(false);
    },
    [dispatch]
  );

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: `/product/[id]`,
      params: {
        id: product.id.toString(),
        productData: JSON.stringify(product),
      },
    });
  };

  const handleSearch = useCallback(
    (query: string) => {
      setLocalSearchQuery(query);
      dispatch(setReduxSearchQuery(query));
    },
    [dispatch]
  );

  const clearCategoryFilter = useCallback(() => {
    const newFilters = { ...reduxFilters, category: null };
    dispatch(setReduxFilters(newFilters));
    router.replace("/(tabs)/products");
  }, [reduxFilters, router, dispatch]);

  const getCategoryDisplayName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleRetryAfterError = useCallback(() => {
    dispatch(clearError());
    handleRefresh();
  }, [dispatch, handleRefresh]);

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right", "bottom"]}
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            Products
          </Text>

          {/* Category filter indicator */}
          {reduxFilters.category && (
            <View className="flex-row items-center mt-1">
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Category: {getCategoryDisplayName(reduxFilters.category)}
              </Text>
              <TouchableOpacity
                onPress={clearCategoryFilter}
                className="ml-2 p-1"
              >
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Products count */}
          {!loading && (
            <Text
              className="text-sm mt-1"
              style={{ color: colors.textSecondary }}
            >
              {sortedProducts.length} product
              {sortedProducts.length !== 1 ? "s" : ""} found
            </Text>
          )}
        </View>

        {/* Right side icons */}
        <View className="flex-row items-center">
          <HeaderCartIcon />

          <TouchableOpacity
            className="p-2 ml-2"
            onPress={() => setShowFilterSheet(true)}
            disabled={loading}
          >
            <Ionicons
              name="filter"
              size={24}
              color={loading ? colors.textSecondary : colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 ml-1"
            onPress={handleRefresh}
            disabled={loading || refreshing}
          >
            <Ionicons
              name="refresh"
              size={24}
              color={
                loading || refreshing ? colors.textSecondary : colors.primary
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <SearchBar
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          onSearch={handleSearch}
          placeholder="Search products..."
        />
      </View>

      {/* Error State */}
      {error && !loading && (
        <View className="mx-6 mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
          <View className="flex-row items-center">
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text className="ml-2 text-red-800 font-medium flex-1">
              {error}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleRetryAfterError}
            className="mt-2 bg-red-600 px-3 py-2 rounded self-start"
          >
            <Text className="text-white text-sm font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SCROLLABLE PRODUCTS LIST */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
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
              {sortedProducts.length === 0 && !loading && !error && (
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
                    className="text-center mt-2 px-4"
                    style={{ color: colors.textSecondary }}
                  >
                    {reduxSearchQuery || reduxFilters.category
                      ? "Try adjusting your search terms or filters"
                      : "No products available at the moment"}
                  </Text>

                  {/* Clear filters button if filters are applied */}
                  {(reduxSearchQuery || reduxFilters.category) && (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(clearFilters());
                        setLocalSearchQuery("");
                        router.replace("/(tabs)/products");
                      }}
                      className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
                    >
                      <Text style={{ color: colors.text }}>
                        Clear all filters
                      </Text>
                    </TouchableOpacity>
                  )}
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
        filters={reduxFilters}
        onApplyFilters={handleApplyFilters}
        categories={categories}
      />
    </SafeAreaView>
  );
}
