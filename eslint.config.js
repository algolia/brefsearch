import config from 'aberlaas/configs/eslint';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  ...config,
  {
    files: ['**/modules/website/**/*.{js,jsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    files: ['**/modules/website/**/*.{ts,tsx}'],
    plugins: {
      react,
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './modules/website/tsconfig.json',
        },
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
