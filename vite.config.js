import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['f0e9d3ec7b4e.ngrok-free.app', 'localhost'],
    port: 3000,
    open: true,
    proxy: {
      '/estudiantes': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/user': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/refresh-token': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/evaluacion': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/niveles': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/administracion': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/finanzas': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://app:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context')
    }
  }
});
