const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        'plugin:unicorn/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:tailwindcss/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
    ],
    ignorePatterns: ['dist'],
    parser: '@typescript-eslint/parser',
    parserOptions: { project: ['./tsconfig.json', './tsconfig.node.json'] },
    settings: {
        'import/resolver': {
            typescript: {},
        },
        tailwindcss: {
            callees: ['cn'],
        },
    },
    plugins: ['react-refresh', 'simple-import-sort'],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

        'simple-import-sort/imports': [
            'error',
            {
                // Custom import grouping see https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping
                // Type imports always go last in their group (we use String.raw to avoid a bunch of escaping)
                groups: [
                    // Side effect imports. (import './file.ts')
                    [String.raw`^\u0000`],

                    // Packages.
                    // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
                    [String.raw`^@?\w`, String.raw`^@?\w.*\u0000$`],

                    // Local package imports.
                    // Anything that starts with a dot or ~/
                    [
                        String.raw`^\.`,
                        String.raw`^`,
                        String.raw`^~/`,
                        String.raw`^\..*\u0000$`,
                        String.raw`^[^.].*\u0000$`,
                        String.raw`^~/.*\u0000$`,
                    ],
                ],
            },
        ],

        'object-shorthand': ['error', 'always'],

        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
                disallowTypeAnnotations: true,
                fixStyle: 'inline-type-imports',
            },
        ],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-confusing-void-expression': [
            'error',
            { ignoreArrowShorthand: true },
        ],

        'unicorn/no-null': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-new-array': 'off',
    },
});
