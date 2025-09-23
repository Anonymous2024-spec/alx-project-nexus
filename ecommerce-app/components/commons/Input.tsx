import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  // Dynamic styling based on state
  const containerClasses = `
    bg-white border rounded-lg px-4 py-3 flex-row items-center
    ${isFocused ? 'border-primary-500' : 'border-neutral-200'}
    ${error ? 'border-error' : ''}
    ${disabled ? 'bg-neutral-100 opacity-60' : ''}
  `;

  const textInputClasses = `
    flex-1 text-base text-neutral-800
    ${multiline ? 'min-h-[100px]' : ''}
  `;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="mb-4">
      {/* Label */}
      {label && (
        <Text className="text-sm font-medium text-neutral-700 mb-2">
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View className={containerClasses}>
        {/* Left Icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color="#6C757D"
            style={{ marginRight: 12 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          className={textInputClasses}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#ADB5BD"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable && !disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          textAlignVertical={multiline ? 'top' : 'center'}
        />

        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color="#6C757D"
            />
          </TouchableOpacity>
        )}

        {/* Password Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={handleTogglePassword}
            activeOpacity={0.7}
            style={{ marginLeft: rightIcon ? 8 : 0 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#6C757D"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-error text-sm mt-1 ml-1">
          {error}
        </Text>
      )}

      {/* Character Counter */}
      {maxLength && value.length > 0 && (
        <Text className="text-neutral-400 text-xs mt-1 ml-1 text-right">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default Input;