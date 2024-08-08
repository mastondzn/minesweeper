import { defineConfig } from '@mastondzn/eslint';

export default defineConfig({
    stylistic: false,

    typescript: {
        tsconfigPath: ['./tsconfig.json', './tsconfig.node.json'],
    },

    tailwindcss: {
        callees: ['cn', 'clsx', 'cva'],
        tags: ['twx', 'twc'],
        config: 'tailwind.config.cjs',
    },

    rules: {
        'unicorn/prevent-abbreviations': 'off',
        'react/prop-types': 'off',
    },
});
