import antfu from '@antfu/eslint-config'
import gitignore from 'eslint-config-flat-gitignore'

export default antfu(
  {
    jsonc: true,
    react: true,
    stylistic: true,
    typescript: true,
  },
  gitignore(),
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'perfectionist/sort-enums': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-imports': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-interfaces': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-objects': ['error', { type: 'alphabetical' }],
      'style/quote-props': ['error', 'as-needed'],
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
)
