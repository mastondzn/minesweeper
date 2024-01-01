import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig({
    plugins: [
        react(),
        sentryVitePlugin({
            org: 'synopsisgg',
            project: 'minesweeper',
        }) as PluginOption,
    ],
    resolve: { alias: { '~': path.resolve(__dirname, './src') } },
    build: { sourcemap: true },
});
