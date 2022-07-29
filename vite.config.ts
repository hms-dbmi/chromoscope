import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/goscan/',
    optimizeDeps: {
        include: ['gosling.js']
    },
    plugins: [reactRefresh()]
});
