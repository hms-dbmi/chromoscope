import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gosling-app-sv/',
  optimizeDeps: {
    include: ['gosling.js']
  },
  plugins: [reactRefresh()]
})
