module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react-hooks/exhaustive-deps': [
      'error',
      { additionalHooks: '(useMemoOne)' }
    ],
    // "max-len": ["error", 120],
    '@typescript-eslint/ban-ts-comment': 2,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 0,
    'react-native/no-color-literals': 0,
    'react-native/no-raw-text': 0,
    'import/order': 0,
    'import/prefer-default-export': 0,
    'import/no-anonymous-default-export': 0,
    'import/named': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'import/namespace': 0,
    'import/default': 0,
    'import/no-named-as-default': 0,
    'import/no-unused-modules': 0,
    'import/no-deprecated': 0,
    '@typescript-eslint/indent': 0,
    'react-hooks/rules-of-hooks': 2,

    'jest/no-identical-title': 2,
    'jest/valid-expect': 2,
    camelcase: 0,
    'prefer-destructuring': 2,
    'no-nested-ternary': 2,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'no-var': 0
  }
}
