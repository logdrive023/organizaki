import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const api = process.env.VITE_API_PROXY ?? 'http://localhost:8095'

// Em dev, /api e /uploads vão para a API Go: mesma origem, sem CORS.
// A porta 5173 fica livre de propósito (projetos da energybr usam nesta máquina); 5174–5176 são do OneMinute.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    strictPort: true,
    host: true,
    proxy: {
      '/api': { target: api, changeOrigin: false },
      '/uploads': { target: api, changeOrigin: false },
    },
  },
})
