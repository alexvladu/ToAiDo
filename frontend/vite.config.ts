import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     // Permite accesul din afara containerului
    port: 3000      // Schimbă portul default la 3000 (ca în docker-compose.yml)
  }
})
