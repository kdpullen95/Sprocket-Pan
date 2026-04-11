// https://www.eslint-react.xyz/docs/getting-started/typescript

import eslintReact from '@eslint-react/eslint-plugin';
import eslintJs from '@eslint/js';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
	files: ['**/*.ts', '**/*.tsx'],

	extends: [
		eslintJs.configs.recommended,
		tseslint.configs.recommended,
		eslintReact.configs['recommended-typescript'],
		eslintPrettier,
	],

	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
		},
	},
	rules: {
		'@eslint-react/rules-of-hooks': 'off', // doesn't play well with HOCs. React will explode at runtime instead.
		'@eslint-react/naming-convention-ref-name': 'off', // I just don't like it
		'@eslint-react/exhaustive-deps': 'warn',
		'@eslint-react/set-state-in-effect': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/consistent-type-imports': 'error',
	},
});
