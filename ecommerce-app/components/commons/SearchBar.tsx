import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  showFilterButton?: boolean;
  onFilterPress?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  style?: "default" | "rounded" | "minimal";
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search products...",
  value,
  onChangeText,
  onSearch,
  onFocus,
  onBlur,
  onClear,
  showFilterButton = true,
  onFilterPress,
  disabled = false,
  autoFocus = false,
  style = "default",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedWidth = useRef(new Animated.Value(1)).current;

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();

    // Animate search bar expansion
    Animated.timing(animatedWidth, {
      toValue: 1.1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();

    // Animate search bar back to normal
    Animated.timing(animatedWidth, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Handle search submission
  const handleSearch = () => {
    if (value.trim()) {
      onSearch?.(value.trim());
    }
  };

  // Handle clear action
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  // Style variants
  const getContainerClasses = () => {
    const baseClasses = `
      flex-row items-center bg-white border
      ${isFocused ? "border-primary-500 shadow-sm" : "border-neutral-200"}
      ${disabled ? "opacity-60" : ""}
    `;

    switch (style) {
      case "rounded":
        return `${baseClasses} rounded-full px-4 py-3`;
      case "minimal":
        return `${baseClasses} rounded-md px-3 py-2 border-0 bg-neutral-50`;
      default:
        return `${baseClasses} rounded-lg px-4 py-3`;
    }
  };

  return (
    <Animated.View
      style={{ transform: [{ scaleX: animatedWidth }] }}
      className="mb-4"
    >
      <View className={getContainerClasses()}>
        {/* Search Icon */}
        <TouchableOpacity
          onPress={handleSearch}
          disabled={disabled || !value.trim()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="search"
            size={20}
            color={isFocused ? "#007AFF" : "#6C757D"}
          />
        </TouchableOpacity>

        {/* Search Input */}
        <TextInput
          className="flex-1 text-base text-neutral-800 ml-3"
          placeholder={placeholder}
          placeholderTextColor="#ADB5BD"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          editable={!disabled}
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Clear Button */}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            activeOpacity={0.7}
            className="ml-2"
          >
            <Ionicons name="close-circle" size={20} color="#ADB5BD" />
          </TouchableOpacity>
        )}

        {/* Filter Button */}
        {showFilterButton && (
          <TouchableOpacity
            onPress={onFilterPress}
            activeOpacity={0.7}
            className={`ml-2 p-1 rounded ${isFocused ? "bg-primary-50" : ""}`}
          >
            <Ionicons
              name="options"
              size={20}
              color={isFocused ? "#007AFF" : "#6C757D"}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Preset SearchBar variants for common use cases
export const SearchBarVariants = {
  // Main product search
  ProductSearch: (
    props: Omit<SearchBarProps, "placeholder" | "showFilterButton">
  ) => (
    <SearchBar
      placeholder="Search for products..."
      showFilterButton={true}
      style="default"
      {...props}
    />
  ),

  // Minimal search for headers
  HeaderSearch: (props: Omit<SearchBarProps, "placeholder" | "style">) => (
    <SearchBar
      placeholder="Search..."
      style="minimal"
      showFilterButton={false}
      {...props}
    />
  ),

  // Rounded search for hero sections
  HeroSearch: (props: Omit<SearchBarProps, "style">) => (
    <SearchBar style="rounded" showFilterButton={false} {...props} />
  ),
};

export default SearchBar;
