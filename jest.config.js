module.exports = {
  preset: '@react-native/jest-preset',
  // @react-navigation ships untranspiled ESM; let babel transform it.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*)/)',
  ],
};
