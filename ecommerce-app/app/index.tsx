import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import Button from "../components/commons/Button";
import Input from "../components/commons/Input";
import LoadingSpinner from "../components/commons/LoadingSpinner";
import SearchBar from "../components/commons/SearchBar";

export default function ComponentShowcase() {
  // Component states for demo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo functions
  const handleLogin = () => {
    Alert.alert("Success!", `Email: ${email}`);
  };

  const handleSearch = (query: string) => {
    Alert.alert("Search", `Searching for: ${query}`);
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ScrollView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="bg-primary-500 px-6 py-8 rounded-b-2xl mb-6">
        <Text className="text-white text-2xl font-bold mb-2">
          🎨 UI Components
        </Text>
        <Text className="text-primary-100 text-base">
          Your design system in action
        </Text>
      </View>

      <View className="px-6 space-y-8">
        {/* Buttons Section */}
        <View>
          <Text className="text-xl font-bold text-neutral-800 mb-4">
            🔘 Buttons
          </Text>
          <View className="space-y-3">
            <Button
              title="Primary Button"
              onPress={() => Alert.alert("Primary pressed!")}
              variant="primary"
            />
            <Button
              title="Secondary Button"
              onPress={() => Alert.alert("Secondary pressed!")}
              variant="secondary"
            />
            <Button
              title="Outline Button"
              onPress={() => Alert.alert("Outline pressed!")}
              variant="outline"
            />
            <Button
              title="With Icon"
              onPress={() => Alert.alert("Icon button pressed!")}
              variant="primary"
              icon="heart"
              iconPosition="left"
            />
            <Button
              title="Loading Button"
              onPress={handleLoadingDemo}
              variant="primary"
              loading={loading}
            />
          </View>
        </View>

        {/* Search Section */}
        <View>
          <Text className="text-xl font-bold text-neutral-800 mb-4">
            🔍 Search Bars
          </Text>
          <SearchBar
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={handleSearch}
            onFilterPress={() => Alert.alert("Filter pressed!")}
          />
          <SearchBar
            placeholder="Minimal search..."
            value=""
            onChangeText={() => {}}
            style="minimal"
            showFilterButton={false}
          />
          <SearchBar
            placeholder="Rounded search..."
            value=""
            onChangeText={() => {}}
            style="rounded"
            showFilterButton={false}
          />
        </View>

        {/* Inputs Section */}
        <View>
          <Text className="text-xl font-bold text-neutral-800 mb-4">
            📝 Input Fields
          </Text>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed"
          />
          <Input
            label="Bio (Multiline)"
            placeholder="Tell us about yourself..."
            value=""
            onChangeText={() => {}}
            multiline
            numberOfLines={4}
            maxLength={150}
          />
          <Input
            label="Disabled Input"
            placeholder="This is disabled"
            value="Cannot edit this"
            onChangeText={() => {}}
            disabled
          />
          <Input
            label="Error State"
            placeholder="This has an error"
            value=""
            onChangeText={() => {}}
            error="This field is required"
          />
        </View>

        {/* Loading Spinners Section */}
        <View>
          <Text className="text-xl font-bold text-neutral-800 mb-4">
            ⏳ Loading Spinners
          </Text>
          <View className="space-y-4">
            <View className="bg-white p-4 rounded-lg">
              <Text className="font-medium mb-2">Small Spinner</Text>
              <LoadingSpinner size="small" text="Loading..." />
            </View>
            <View className="bg-white p-4 rounded-lg">
              <Text className="font-medium mb-2">Medium Spinner (Primary)</Text>
              <LoadingSpinner
                size="medium"
                color="primary"
                text="Fetching products..."
              />
            </View>
            <View className="bg-secondary-500 p-4 rounded-lg">
              <Text className="font-medium mb-2 text-white">White Spinner</Text>
              <LoadingSpinner
                size="medium"
                color="white"
                text="Please wait..."
              />
            </View>
          </View>
        </View>

        {/* Action Section */}
        <View className="bg-white p-6 rounded-lg mb-8">
          <Text className="text-lg font-semibold text-neutral-800 mb-4">
            🚀 Test Your Components
          </Text>
          <Button
            title="Login Demo"
            onPress={handleLogin}
            variant="primary"
            icon="log-in"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}
