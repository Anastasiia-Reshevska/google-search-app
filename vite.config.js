import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    host: process.env.VITE_HOST || 'localhost',
    strictPort: true,
    proxy: { '/api/': 'http://127.0.0.1:3001' },
  },
  preview: {
    proxy: { '/api/': 'http://127.0.0.1:3001' },
  },
  css: {
    preprocessorOptions: {
      scss: { loadPaths: ['node_modules'] },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
