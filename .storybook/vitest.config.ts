import storybookTest from '@storybook/addon-vitest/vitest-plugin'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from '../vite.config'

export default defineConfig((env) =>
  mergeConfig(viteConfig(env), {
    plugins: [
      storybookTest({
        configDir: fileURLToPath(new URL('./', import.meta.url)),
      }),
    ],
    test: {
      browser: {
        enabled: true,
        headless: true,
        instances: [{ browser: 'chromium' }],
        provider: 'playwright',
      },
      setupFiles: [
        fileURLToPath(new URL('./vitest.setup.ts', import.meta.url)),
      ],
      watch: false,
    },
  }),
)
