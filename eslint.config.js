import config from 'aberlaas/configs/eslint';
import react from 'eslint-plugin-react';
import globals from 'globals';

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
];
