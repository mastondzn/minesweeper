import antfu, { renameRules } from '@antfu/eslint-config';
import ts from '@typescript-eslint/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';
import tailwind from 'eslint-plugin-tailwindcss';

export default antfu(
    // antfu config
    {
        react: true,
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
                'object-shorthand': ['error', 'always'],
            },
        },

        ignores: ['tailwind.config.js', 'postcss.config.js', '.prettierrc.cjs'],
    },

    // flat overrides
    {
        plugins: {
            // eslint-disable-next-line ts/no-unsafe-assignment
            unicorn,
        },
        rules: {
            // eslint-disable-next-line ts/no-unsafe-member-access, ts/ban-types
            ...(unicorn?.configs?.recommended?.rules as {}),

            'unicorn/no-null': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-new-array': 'off',
            'unicorn/no-nested-ternary': 'off',
        },
    },

    {
        plugins: {
            // eslint-disable-next-line ts/no-unsafe-assignment
            tailwindcss: tailwind,
        },
        settings: {
            tailwindcss: {
                callees: ['cn', 'twc', 'twx'],
            },
        },
        rules: {
            // eslint-disable-next-line ts/no-unsafe-member-access, ts/ban-types
            ...(tailwind?.configs?.recommended?.rules as {}),
        },
    },
);
