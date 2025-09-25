import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProductFilters } from "@/types/product";

const { height: screenHeight } = Dimensions.get("window");

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onApplyFilters: (filters: ProductFilters) => void;
}

interface Category {
  id: string;
  name: string;
  selected: boolean;
}

export function FilterBottomSheet({
  visible,
  onClose,
  filters,
  onApplyFilters,
}: FilterBottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [categories, setCategories] = useState<Category[]>([
    { id: "electronics", name: "Electronics", selected: false },
    { id: "fashion", name: "Fashion", selected: true },
    { id: "books", name: "Books", selected: false },
  ]);

  const [priceRange, setPriceRange] = useState({
    min: filters.priceRange.min,
    max: filters.priceRange.max,
  });

  const [sortBy, setSortBy] = useState(filters.sortBy);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, selected: !cat.selected } : cat
      )
    );
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleReset = () => {
    setCategories((prev) => prev.map((cat) => ({ ...cat, selected: false })));
    setPriceRange({ min: 0, max: 2000 });
    setSortBy("price_asc");
  };

  const handleApplyFilters = () => {
    const selectedCategories = categories
      .filter((cat) => cat.selected)
      .map((cat) => cat.id);

    const newFilters: ProductFilters = {
      category: selectedCategories.length > 0 ? selectedCategories[0] : null,
      priceRange,
      sortBy,
    };

    onApplyFilters(newFilters);
    handleClose();
  };

  const PriceRangeSlider = () => {
    const minPercent = (priceRange.min / 2000) * 100;
    const maxPercent = (priceRange.max / 2000) * 100;

    return (
      <View className="mt-4">
        <View className="h-2 bg-neutral-200 rounded-full relative">
          <View
            className="absolute h-2 bg-primary-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </View>

        <View className="flex-row justify-between mt-3">
          <Text className="text-neutral-600">$0</Text>
          <Text className="text-neutral-600">$2000</Text>
        </View>

        <View className="flex-row justify-center mt-2">
          <Text className="text-neutral-800 font-medium">
            ${priceRange.min} - ${priceRange.max}
          </Text>
        </View>

        {/* Simple price adjustment buttons */}
        <View className="flex-row justify-between mt-4">
          <View>
            <Text className="text-sm text-neutral-600 mb-2">Min Price</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-neutral-100 rounded-lg p-2"
                onPress={() =>
                  handlePriceChange("min", Math.max(0, priceRange.min - 50))
                }
              >
                <Ionicons name="remove" size={16} color="#6C757D" />
              </TouchableOpacity>
              <Text className="mx-3 font-medium">${priceRange.min}</Text>
              <TouchableOpacity
                className="bg-neutral-100 rounded-lg p-2"
                onPress={() =>
                  handlePriceChange(
                    "min",
                    Math.min(priceRange.max - 50, priceRange.min + 50)
                  )
                }
              >
                <Ionicons name="add" size={16} color="#6C757D" />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-sm text-neutral-600 mb-2">Max Price</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-neutral-100 rounded-lg p-2"
                onPress={() =>
                  handlePriceChange(
                    "max",
                    Math.max(priceRange.min + 50, priceRange.max - 50)
                  )
                }
              >
                <Ionicons name="remove" size={16} color="#6C757D" />
              </TouchableOpacity>
              <Text className="mx-3 font-medium">${priceRange.max}</Text>
              <TouchableOpacity
                className="bg-neutral-100 rounded-lg p-2"
                onPress={() =>
                  handlePriceChange("max", Math.min(2000, priceRange.max + 50))
                }
              >
                <Ionicons name="add" size={16} color="#6C757D" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      animationType="none"
    >
      {/* Backdrop */}
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={handleClose}
      >
        <View className="flex-1" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{
          transform: [{ translateY: slideAnim }],
          maxHeight: screenHeight * 0.85,
        }}
      >
        {/* Header */}
        <View className="bg-primary-500 flex-row items-center justify-between px-6 py-4 rounded-t-3xl">
          <TouchableOpacity onPress={handleClose}>
            <View className="flex-row items-center">
              <Ionicons name="close" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Close</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-white font-bold text-lg">Filters</Text>

          <TouchableOpacity onPress={handleReset}>
            <Text className="text-white font-medium">Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-6">
          {/* Categories */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Categories
            </Text>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="flex-row items-center mb-3"
                onPress={() => handleCategoryToggle(category.id)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                    category.selected
                      ? "bg-primary-500 border-primary-500"
                      : "border-neutral-300"
                  }`}
                >
                  {category.selected && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-neutral-800 text-base">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Price Range
            </Text>
            <PriceRangeSlider />
          </View>

          {/* Sort Options */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Sort By
            </Text>
            <TouchableOpacity
              className="flex-row items-center mb-3"
              onPress={() => setSortBy("price_desc")}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  sortBy === "price_desc"
                    ? "border-primary-500"
                    : "border-neutral-300"
                }`}
              >
                {sortBy === "price_desc" && (
                  <View className="w-3 h-3 rounded-full bg-primary-500" />
                )}
              </View>
              <Text className="text-neutral-800 text-base">
                Price: High to Low
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center mb-3"
              onPress={() => setSortBy("name")}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  sortBy === "name"
                    ? "border-primary-500"
                    : "border-neutral-300"
                }`}
              >
                {sortBy === "name" && (
                  <View className="w-3 h-3 rounded-full bg-primary-500" />
                )}
              </View>
              <Text className="text-neutral-800 text-base">Name: A to Z</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="px-6 py-4 border-t border-neutral-100">
          <TouchableOpacity
            className="bg-primary-500 py-4 rounded-xl"
            onPress={handleApplyFilters}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
