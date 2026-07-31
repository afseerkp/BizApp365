import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const docsDir = path.resolve(__dirname, 'docs')

/** GitHub Pages: skip Jekyll, SPA fallbacks, and static legal pages (HTTP 200 for store crawlers). */
function githubPages(): import('vite').Plugin {
  return {
    name: 'github-pages',
    async closeBundle() {
      fs.writeFileSync(path.join(docsDir, '.nojekyll'), '')
      fs.copyFileSync(path.join(docsDir, 'index.html'), path.join(docsDir, '404.html'))

      const { generateLegalStaticPages } = await import('./scripts/generateLegalStaticPages.mjs')
      generateLegalStaticPages()
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), githubPages()],
  base: '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
        },
      },
    },
  },
})
