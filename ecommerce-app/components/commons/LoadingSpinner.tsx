import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white' | 'dark';
  text?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  overlay = false,
  fullScreen = false,
}) => {
  // Size mapping for ActivityIndicator
  const spinnerSizes = {
    small: 'small',
    medium: 'large',
    large: 'large',
  } as const;

  // Color mapping
  const colors = {
    primary: '#007AFF',
    secondary: '#FF6B35', 
    white: '#FFFFFF',
    dark: '#212529',
  };

  // Container styling based on props
  const getContainerClasses = () => {
    if (fullScreen || overlay) {
      return `
        absolute inset-0 
        ${overlay ? 'bg-black/20' : 'bg-white'} 
        items-center justify-center z-50
      `;
    }
    return 'items-center justify-center p-4';
  };

  // Text styling based on spinner color
  const getTextClasses = () => {
    const baseClasses = 'mt-3 text-center font-medium';
    
    switch (color) {
      case 'white':
        return `${baseClasses} text-white`;
      case 'dark':
        return `${baseClasses} text-neutral-800`;
      case 'secondary':
        return `${baseClasses} text-secondary-500`;
      default:
        return `${baseClasses} text-primary-500`;
    }
  };

  // Spinner wrapper for size-specific styling
  const getSpinnerWrapperClasses = () => {
    const baseClasses = 'items-center justify-center';
    
    switch (size) {
      case 'small':
        return `${baseClasses} w-8 h-8`;
      case 'large':
        return `${baseClasses} w-16 h-16`;
      default:
        return `${baseClasses} w-12 h-12`;
    }
  };

  return (
    <View className={getContainerClasses()}>
      <View className={getSpinnerWrapperClasses()}>
        <ActivityIndicator
          size={spinnerSizes[size]}
          color={colors[color]}
        />
      </View>
      
      {text && (
        <Text className={getTextClasses()}>
          {text}
        </Text>
      )}
    </View>
  );
};

// Preset loading states for common use cases
export const LoadingStates = {
  // Full screen loading (app initialization)
  FullScreen: ({ text = "Loading..." }: { text?: string }) => (
    <LoadingSpinner 
      size="large" 
      color="primary" 
      text={text} 
      fullScreen 
    />
  ),

  // Overlay loading (on top of content)
  Overlay: ({ text = "Loading..." }: { text?: string }) => (
    <LoadingSpinner 
      size="medium" 
      color="primary" 
      text={text} 
      overlay 
    />
  ),

  // Inline loading (within components)
  Inline: ({ text }: { text?: string }) => (
    <LoadingSpinner 
      size="small" 
      color="primary" 
      text={text} 
    />
  ),

  // Button loading (inside buttons)
  Button: ({ color = 'white' }: { color?: 'white' | 'primary' }) => (
    <LoadingSpinner 
      size="small" 
      color={color} 
    />
  ),
};

export default LoadingSpinner;