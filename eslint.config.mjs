import { maston } from '@mastondzn/eslint';

export default maston({
    typescript: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
    },

    tailwindcss: {
        callees: ['cn', 'clsx', 'cva'],
        tags: ['twx', 'twc'],
        config: 'tailwind.config.cjs',
    },

    rules: {
        'react/prop-types': 'off',
    },
});
