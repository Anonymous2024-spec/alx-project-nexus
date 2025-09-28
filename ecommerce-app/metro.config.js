const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  // Add this to reset the TypeScript config
  isCSSEnabled: true,
});

// Force TypeScript to use commonjs
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  tslib: require.resolve("tslib"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
