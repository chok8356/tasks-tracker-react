export default [
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/features/**',
                '@/infra/**',
                '@/ui/**',
                '@/shared/**',
                'react',
                'react-router',
                'react-router-dom',
                '@tanstack/**',
              ],
              message:
                'Domain layer must not depend on feature contracts, infra, UI, shared utilities, router, or framework libraries.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/infra/**',
                '@/ui/**',
                'react',
                'react-router',
                'react-router-dom',
                '@tanstack/**',
              ],
              message:
                'Feature action contracts must stay framework-agnostic and must not depend on infra or UI.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/infra/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/ui/**', 'react-router', 'react-router-dom'],
              message: 'Infra layer must not depend on UI or router code.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/ui/query-hooks/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/infra/**', '@/ui/router/**'],
              message:
                'UI query-hooks must bind feature actions to React Query and stay independent from infra and router.',
            },
          ],
        },
      ],
    },
  },
]
