import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const docsDir = path.resolve(__dirname, 'docs')

/** GitHub Pages: skip Jekyll and support client-side routes on refresh. */
function githubPages(): import('vite').Plugin {
  return {
    name: 'github-pages',
    closeBundle() {
      fs.writeFileSync(path.join(docsDir, '.nojekyll'), '')
      fs.copyFileSync(path.join(docsDir, 'index.html'), path.join(docsDir, '404.html'))
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
