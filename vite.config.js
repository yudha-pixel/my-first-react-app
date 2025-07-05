import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.trakt.tv',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      '/images': {
        target: 'https://walter.trakt.tv',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/images/, ''),
      },
    },
  }
})
