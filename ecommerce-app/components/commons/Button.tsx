import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}) => {
  // Base styles that apply to all variants
  const baseClasses = 'rounded-lg flex-row items-center justify-center';
  
  // Variant-specific styles
  const variantClasses = {
    primary: 'bg-primary-500 shadow-sm',
    secondary: 'bg-secondary-500 shadow-sm',
    outline: 'border-2 border-primary-500 bg-transparent',
    ghost: 'bg-transparent',
  };

  // Size-specific styles
  const sizeClasses = {
    small: 'px-3 py-2',
    medium: 'px-4 py-3',
    large: 'px-6 py-4',
  };

  // Text color based on variant
  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-white', 
    outline: 'text-primary-500',
    ghost: 'text-primary-500',
  };

  // Text size based on button size
  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Disabled styles
  const disabledClasses = disabled ? 'opacity-50' : '';
  
  // Full width style
  const widthClasses = fullWidth ? 'w-full' : '';

  // Icon size based on button size
  const iconSizes = {
    small: 16,
    medium: 18,
    large: 20,
  };

  const iconColor = variant === 'primary' || variant === 'secondary' ? 'white' : '#007AFF';

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? 'white' : '#007AFF'} 
        />
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <Ionicons 
            name={icon} 
            size={iconSizes[size]} 
            color={iconColor}
            style={{ marginRight: 8 }}
          />
        )}
        <Text className={`font-semibold ${textColorClasses[variant]} ${textSizeClasses[size]}`}>
          {title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Ionicons 
            name={icon} 
            size={iconSizes[size]} 
            color={iconColor}
            style={{ marginLeft: 8 }}
          />
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${widthClasses}
      `}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;