import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/chromoscope/',
    build: { target: 'esnext' },
    optimizeDeps: {
        include: ['gosling.js']
    },
    plugins: [reactRefresh()]
});
