import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    port: 4001,
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Backend server URL
        changeOrigin: true,
        timeout: 50000,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix if needed
      },
    },
  },
})