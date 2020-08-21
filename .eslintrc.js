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
  settings: {
    'import/resolver': 'webpack',
    'import/extensions': ['.js', '.mjs', '.ts', '.svelte'],
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        ts: 'never',
        svelte: 'never',
      },
    ],
  },
};
