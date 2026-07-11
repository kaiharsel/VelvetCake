import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split heavy third-party libs into cacheable vendor chunks.
    // Vite 8 / Rolldown expects manualChunks as a function.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Firebase SDK is only used by lazily-loaded code (CMS, leads, CRM),
          // so isolate it: it must not ride in a chunk the home page eagerly
          // downloads.
          if (/[\\/]@?firebase[\\/]/.test(id)) return 'firebase-sdk'
          if (/[\\/]gsap[\\/]/.test(id)) return 'gsap'
          if (/[\\/]framer-motion[\\/]/.test(id)) return 'motion'
          if (/[\\/]lenis[\\/]/.test(id)) return 'lenis'
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
            return 'react'
          return 'vendor'
        },
      },
    },
  },
})
