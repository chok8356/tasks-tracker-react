import antfu from '@antfu/eslint-config'
import gitignore from 'eslint-config-flat-gitignore'

export default antfu(
  {
    jsonc: true,
    react: true,
    stylistic: false,
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
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
)
