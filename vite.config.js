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
        pricing: resolve(__dirname, 'pricing.html'),
        contact: resolve(__dirname, 'contact.html'),
        'nid-ocr': resolve(__dirname, 'nid-ocr.html'),
        'face-match': resolve(__dirname, 'face-match.html'),
        liveness: resolve(__dirname, 'liveness.html'),
        'name-translation': resolve(__dirname, 'name-translation.html'),
        'gender-estimation': resolve(__dirname, 'gender-estimation.html'),
      },
    },
  },
})
