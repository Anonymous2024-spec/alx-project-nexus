/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F3FF',
          100: '#CCE7FF', 
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#007AFF', // Main primary
          600: '#0056CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          50: '#FFF4F0',
          100: '#FFE9E0',
          200: '#FFD3C2', 
          300: '#FFBDA3',
          400: '#FF9669',
          500: '#FF6B35', // Main secondary
          600: '#E55A2B',
          700: '#CC4921',
          800: '#B23817',
          900: '#99270D',
        },
        neutral: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D', // Main neutral
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#000000',
        },
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
      },
      fontFamily: {
        'system': ['System'],
        'system-medium': ['System'],
        'system-bold': ['System'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      shadows: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 12px rgba(0, 122, 255, 0.3)',
      }
    },
  },
  plugins: [],
}