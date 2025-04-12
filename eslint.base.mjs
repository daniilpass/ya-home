import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default defineConfig([
    globalIgnores([
        '**/dist/',
        '**/build/',
    ]),
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/ban-ts-comment': 'off',
            'quotes': [2, 'single', { 'avoidEscape': true }],
            'jsx-quotes': [2, 'prefer-double'],
        }
    },
]);