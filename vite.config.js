import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the key change
    host: true, // Listens on 0.0.0.0 for external access
    port: 5173
  }
})