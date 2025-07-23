import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['7746d009d1f9.ngrok-free.app', 'localhost'],
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/estudiantes': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/evaluaciones': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/niveles': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/administracion': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/finanzas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
