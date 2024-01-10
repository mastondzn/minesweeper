import antfu from '@antfu/eslint-config';

export default antfu({
    react: true,
    stylistic: false,

    typescript: {
        tsconfigPath: ['./tsconfig.json', './tsconfig.node.json'],
    },
});
