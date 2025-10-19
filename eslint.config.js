import antfu from '@antfu/eslint-config'
import gitignore from 'eslint-config-flat-gitignore'
import perfectionist from 'eslint-plugin-perfectionist'
import storybook from 'eslint-plugin-storybook'

export default antfu(
  {
    jsonc: true,
    react: true,
    stylistic: false,
    typescript: true,
  },
  gitignore(),
  {
    ignores: ['src/api/schema/generated.ts', 'public/mockServiceWorker.js'],
  },
  ...storybook.configs['flat/recommended'],
  {
    rules: perfectionist.configs['recommended-natural'].rules,
  },
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      'react/no-context-provider': 'off',
      'ts/consistent-type-definitions': ['error', 'type'],
      'unicorn/throw-new-error': 'off',
    },
  },
)
