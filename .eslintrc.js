module.exports = {
  extends: [
    // 'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  globals: {
    ga: 'readonly',
  },
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};
