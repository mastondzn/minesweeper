/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { vite as million } from 'million/compiler';
import { defineConfig } from 'vite';
import paths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [million({ auto: true }), react(), paths()],
    test: {
        environment: 'happy-dom',
    },
});
