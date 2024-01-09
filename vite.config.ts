/// <reference types="vitest" />

import { sentryVitePlugin } from '@sentry/vite-plugin';
import reactVitePlugin from '@vitejs/plugin-react';
import { vite as millionVitePlugin } from 'million/compiler';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig({
    plugins: [
        millionVitePlugin({
            auto: true,
        }),
        reactVitePlugin(),
        sentryVitePlugin({
            org: 'synopsisgg',
            project: 'minesweeper',
        }) as PluginOption,
    ],
    resolve: {
        alias: { '~': resolve(dirname(fileURLToPath(import.meta.url)), './src') },
    },
    build: { sourcemap: true },
    test: { environment: 'happy-dom' },
});
