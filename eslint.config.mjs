import antfu, { renameRules } from '@antfu/eslint-config';
import ts from '@typescript-eslint/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';

export default antfu(
    {
        stylistic: false,

        typescript: {
            tsconfigPath: ['./tsconfig.json', './tsconfig.node.json'],
            overrides: {
                ...renameRules(
                    {
                        ...ts.configs['recommended-type-checked'].rules,
                        ...ts.configs['strict-type-checked'].rules,
                        ...ts.configs['stylistic-type-checked'].rules,
                    },
                    '@typescript-eslint/',
                    'ts/',
                ),

                'ts/no-non-null-assertion': 'warn',
                'ts/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
            },
        },

        javascript: {
            overrides: {
                'object-shorthand': ['error', 'consistent-as-needed'],
            },
        },

        react: {
            overrides: { 'react/prop-types': 'off' },
        },

        ignores: ['tailwind.config.js', 'postcss.config.js', '.prettierrc.cjs'],
    },

    // flat overrides
    {
        files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
        plugins: {
            // eslint-disable-next-line ts/no-unsafe-assignment
            unicorn: unicorn,
            // eslint-disable-next-line ts/no-unsafe-assignment
            tailwindcss: tailwind,
        },
        settings: {
            tailwindcss: {
                callees: ['cn', 'twc', 'twx'],
            },
        },
        // eslint-disable-next-line ts/no-unsafe-assignment
        rules: {
            // eslint-disable-next-line ts/no-unsafe-member-access
            ...unicorn.configs.recommended.rules,
            // eslint-disable-next-line ts/no-unsafe-member-access
            ...tailwind.configs.recommended.rules,

            'unicorn/no-null': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-nested-ternary': 'off',
        },
    },
    prettier,
);
