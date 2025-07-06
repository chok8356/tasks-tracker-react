import antfu from '@antfu/eslint-config'
import gitignore from 'eslint-config-flat-gitignore'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default antfu(
  {
    jsonc: true,
    react: true,
    stylistic: true,
    typescript: true,
  },
  gitignore(),
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'antfu/consistent-list-newline': 'off',
      curly: ['error', 'all'],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'perfectionist/sort-enums': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-imports': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-interfaces': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-objects': ['error', { type: 'alphabetical' }],
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'always',
          bracketSameLine: true,
          bracketSpacing: true,
          endOfLine: 'lf',
          printWidth: 80,
          proseWrap: 'always',
          semi: false,
          singleAttributePerLine: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'all',
        },
      ],
      'react-refresh/only-export-components': 'warn',
      'style/quote-props': ['error', 'as-needed'],
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
)
