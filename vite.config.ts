import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',          // Vercel serves from root — no subdirectory prefix needed
  plugins: [react()],
})
