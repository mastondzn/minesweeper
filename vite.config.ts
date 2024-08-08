/// <reference types="vitest" />

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import reactVitePlugin from '@vitejs/plugin-react';
import { vite as millionVitePlugin } from 'million/compiler';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [millionVitePlugin({ auto: true }), reactVitePlugin()],
    resolve: {
        alias: { '~': resolve(dirname(fileURLToPath(import.meta.url)), './src') },
    },
    build: {
        sourcemap: true,
    },
    test: {
        environment: 'happy-dom',
    },
});
