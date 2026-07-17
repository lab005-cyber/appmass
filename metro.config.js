const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': './app',
  '@components': './app/components',
  '@hooks': './app/hooks',
  '@services': './app/services',
  '@utils': './app/utils',
  '@store': './app/store',
  '@config': './config',
};

module.exports = config;
