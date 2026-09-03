import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Tiny HTML include plugin: resolves <!--#include file="..." --> at dev/build time.
// Paths are resolved relative to the HTML file that contains the include.
const __dirname = dirname(fileURLToPath(import.meta.url))
function htmlInclude() {
  return {
    name: 'html-include',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const baseDir = ctx.filename ? dirname(ctx.filename) : __dirname
        return html.replace(
          /<!--\s*#include\s+file="([^"]+)"\s*-->/g,
          (_, file) => {
            const target = resolve(baseDir, file)
            if (!fs.existsSync(target)) {
              throw new Error(`[html-include] missing partial: ${target}`)
            }
            return fs.readFileSync(target, 'utf8')
          }
        )
      },
    },
  }
}

export default defineConfig({
  plugins: [htmlInclude()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'docs.html'),
        playground: resolve(__dirname, 'playground.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
