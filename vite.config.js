// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'          // react plagini qo'shing (sizda bor)
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),           // React uchun zarur
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://app.dentago.uz',
        changeOrigin: true,
        secure: false,           // http ishlatilayotgani uchun (https bo'lsa true qilish mumkin)
        // rewrite ni olib tashladik, chunki endpointlar to'g'ridan-to'g'ri /api/... bilan keladi
      }
    }
  }
})