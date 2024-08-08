import { defineConfig } from '@mastondzn/eslint';

export default defineConfig({
    stylistic: false,

    typescript: {
        tsconfigPath: ['./tsconfig.json', './tsconfig.node.json'],
    },

    tailwindcss: {
        callees: ['cn', 'clsx', 'cva'],
        tags: ['twx', 'twc'],
    },

    rules: {
        'unicorn/prevent-abbreviations': 'off',
    },
});
