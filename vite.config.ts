import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import pkg from './package.json';

// https://vitejs.dev/config/
const browser = defineConfig({
    build: { target: 'esnext' },
    optimizeDeps: {
        include: ['gosling.js']
    },
    plugins: [reactRefresh()]
});

const lib = defineConfig({
    build: {
        target: 'esnext',
        outDir: 'lib',
        minify: false,
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: pkg.name
        }
    },
    optimizeDeps: {
        include: ['gosling.js']
    },
    plugins: [reactRefresh()]
});

export default ({ command, mode }) => {
    if (command === 'build' && mode === 'lib') return lib;
    return browser;
};
