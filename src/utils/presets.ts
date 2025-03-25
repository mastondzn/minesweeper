const presetList = (
    [
        {
            name: 'beginner',
            width: 9,
            height: 9,
            mines: 10,
        },
        {
            name: 'intermediate',
            width: 16,
            height: 16,
            mines: 40,
        },
        {
            name: 'expert',
            width: 30,
            height: 16,
            mines: 99,
        },
        {
            name: 'evil',
            width: 30,
            height: 20,
            mines: 130,
        },
    ] as const
).map((preset) => {
    // eslint-disable-next-line ts/no-non-null-assertion
    const capitalized = preset.name[0]!.toUpperCase() + preset.name.slice(1);

    return {
        ...preset,
        stylized: `${capitalized} (${preset.width}x${preset.height}, ${preset.mines} mines)`,
    };
});

export type PresetName = (typeof presetList)[number]['name'];
export type Preset = (typeof presetList)[number];

export const presets = {
    list: presetList,
    get: (name: PresetName) => {
        const preset = presets.list.find((preset) => preset.name === name);
        if (!preset) throw new Error(`Preset ${name} not found`);
        return preset;
    },
};
