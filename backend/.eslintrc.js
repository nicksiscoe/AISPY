module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  settings: {
    // [Tell the next plugin where to find next apps (can be a glob too)](https://nextjs.org/docs/pages/building-your-application/configuring/eslint#custom-settings)
    next: {
      rootDir: 'apps/auth/',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['class', 'typeLike'],
        format: ['StrictPascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'variableLike',
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
        filter: {
          match: false,
          regex: '(_)',
        },
        format: null,
      },
      {
        selector: 'memberLike',
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
        filter: {
          match: false,
          regex: '(_)',
        },
        format: null,
      },
      {
        selector: 'typeParameter',
        format: ['StrictPascalCase'],
      },
    ],
  },
};
