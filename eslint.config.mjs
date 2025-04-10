import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import gitignore from 'eslint-config-flat-gitignore';

export default defineConfig([
    gitignore(),
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: { ...globals.es2016, ...{ console: false } } } },
    { files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    { rules: { 'no-undef': 'error' } }
]);
