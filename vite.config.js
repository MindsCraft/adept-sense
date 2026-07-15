import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'docs.html'),
        playground: resolve(__dirname, 'playground.html'),
        explorations: resolve(__dirname, 'internal/trust-strip-explorations.html'),
      },
    },
  },
})
