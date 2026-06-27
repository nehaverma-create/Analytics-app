import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://analytics-app-otm0.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
