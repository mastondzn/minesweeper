/// <reference types="vitest" />

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import reactVitePlugin from '@vitejs/plugin-react';
import { vite as millionVitePlugin } from 'million/compiler';
import { type PluginOption, defineConfig } from 'vite';

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
