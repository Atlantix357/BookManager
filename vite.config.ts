import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3501, // Changed from 3500 to 3501
    host: true, // Allow connections from network
    open: true, // Automatically open browser when starting
    strictPort: false // Changed to false to allow fallback to another port if needed
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          dexie: ['dexie']
        }
      }
    }
  },
  base: './' // Use relative paths instead of absolute
})
