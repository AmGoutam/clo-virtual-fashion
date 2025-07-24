// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        // Keep these includes for robustness, but remove 'force: true'
        include: [
            '@reduxjs/toolkit',
            'react-redux',
        ],
    },
    build: {
        sourcemap: true,
    },
});
