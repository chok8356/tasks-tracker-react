/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

export {}

type ImportMeta = {
  readonly env: ImportMetaEnv
}

type ImportMetaEnv = {
  readonly VITE_API_BASE_URL: string
}
