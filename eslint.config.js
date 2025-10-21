import { createRequire } from 'node:module';
import config from 'aberlaas/configs/eslint';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';

// @typescript-eslint/parser is CommonJS, I need to import it that way for the
// linter to see it's actually imported
const require = createRequire(import.meta.url);
const tsparser = require('@typescript-eslint/parser');

export default [
  ...config,
  {
    ignores: ['out/**/*'],
  },
  // Next.js rules for website module
  {
    files: ['src/app/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // Configure for App Router instead of Pages Router
      '@next/next/no-html-link-for-pages': ['error', 'src/app'],
    },
  },
  {
    files: ['src/app/**/*.{js,jsx}'],
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
    files: ['*.ts', 'src/app/**/*.{ts,tsx}'],
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
          project: './tsconfig.json',
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
