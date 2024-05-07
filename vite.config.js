import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Trainee_04/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
