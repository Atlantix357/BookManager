import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://image-metadata-manager.onrender.com',
      dynamicRoutes: ['/']
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ["image-metadata-manager.onrender.com"]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
