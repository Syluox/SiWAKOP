// vite.config.js (create or update in frontend root)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Proxy all /api requests to backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/') // Optional, adjust if needed
      }
    }
  }
});