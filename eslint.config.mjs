import { defineConfig } from '@mastondzn/eslint';

export default defineConfig(
    {
        typescript: {
            tsconfigPath: ['./tsconfig.json', './tsconfig.node.json'],
        },

        tailwindcss: {
            callees: ['cn', 'clsx', 'cva'],
            tags: ['twx', 'twc'],
        },
    },
);
