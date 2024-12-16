import { defineConfig } from 'vite';

export default defineConfig({
    base: '/my-wallet/',
    build: {
        target: 'esnext',
        outDir: 'dist'
    }
});
