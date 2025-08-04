import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true
  },
  preview: {
    port: 3000,
    host: true
  },
  optimizeDeps: {
    exclude: ['lucide-react', 'timers/promises'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          bootstrap: ['bootstrap'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
