import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default defineConfig((env) =>
  mergeConfig(viteConfig(env), {
    exclude: [...configDefaults.exclude],
    include: ['./src/**/*.test.{ts,tsx}'],
    watch: false,
  }),
)
