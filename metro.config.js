const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Path to the local alistoLogin module
const alistoLoginPath = path.resolve(__dirname, '../../alistoLogin');

// 1. Watch the local module folder
config.watchFolders = [alistoLoginPath];

// 2. Add node_modules resolution for the local module
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(alistoLoginPath, 'node_modules'),
];

// 3. (Optional) Force resolution of shared dependencies to the main project's node_modules
config.resolver.extraNodeModules = {
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'react': path.resolve(__dirname, 'node_modules/react'),
  'expo-linear-gradient': path.resolve(__dirname, 'node_modules/expo-linear-gradient'),
  '@expo/vector-icons': path.resolve(__dirname, 'node_modules/@expo/vector-icons'),
};

module.exports = config;
