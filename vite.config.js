import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd());
  
  // Obtener la URL base de la API desde las variables de entorno o usar un valor por defecto
  const apiUrl = env.VITE_API_URL || 'http://app:5000';
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/estudiantes': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/auth': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/user': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/refresh-token': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/evaluacion': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/niveles': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/administracion': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/finanzas': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/api': {
          target: apiUrl,
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
  };
});
