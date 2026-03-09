import eslint from '@eslint/js'
import gitignore from 'eslint-config-flat-gitignore'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  gitignore(),
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    plugins: {
      perfectionist,
    },
    rules: {
      ...perfectionist.configs['recommended-natural'].rules,
    },
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, prefer: 'type-imports' },
      ],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    },
  },
)
