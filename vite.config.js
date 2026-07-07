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
