export const userKeys = {
  all: ['users'] as const,
  current: () => [...userKeys.all, 'current'] as const,
}
