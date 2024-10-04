/// <reference types="vitest" />

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { vite as million } from 'million/compiler';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [million({ auto: true }), react()],
    resolve: {
        alias: { '~': resolve(dirname(fileURLToPath(import.meta.url)), './src') },
    },
    test: {
        environment: 'happy-dom',
    },
});
