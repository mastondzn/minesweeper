import { defineConfig } from '@mastondzn/eslint';

export default defineConfig(
    {
        typescript: {
            tsconfigPath: ['./tsconfig.json', './tsconfig.node.json'],
        },

        tailwindcss: {
            callees: ['cn', 'twc', 'twx', 'clsx', 'classnames'],
        },

        ignores: ['tailwind.config.js', 'postcss.config.js', '.prettierrc.cjs'],
    },
);
