import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
    globalIgnores([
        '**/dist/',
        '**/build/',
    ]),
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            'semi': ['error', 'always'],
            'no-extra-semi': 'error',
            'no-unexpected-multiline': 'error',
            'semi-spacing': 'error',
            'comma-spacing': 'error',
            'quotes': [2, 'single', { 'avoidEscape': true }],
            'jsx-quotes': [2, 'prefer-double'],
            'import/order': [
                'error',
                {
                    'newlines-between': 'always',
                    'pathGroups': [
                        {
                            group: "external",
                            pattern: "react",
                            position: "before",
                        },
                        {
                            group: "external",
                            pattern: "express",
                            position: "before",
                        },
                        {
                            group: "external",
                            pattern: "@homemap/**",
                            position: "after",
                        },
                    ],
                    'pathGroupsExcludedImportTypes': ['builtin'],
                },
            ],
        },
        settings: {
            'import/resolver': {
                'typescript': true,
                'node': true,
            },
        },
    },
]);