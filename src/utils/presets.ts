import { type Preset } from './types';

export const presets = {
    beginner: {
        width: 9,
        height: 9,
        mines: 10,
    },
    intermediate: {
        width: 16,
        height: 16,
        mines: 40,
    },
    expert: {
        width: 30,
        height: 16,
        mines: 99,
    },
    evil: {
        width: 30,
        height: 20,
        mines: 130,
    },
} satisfies Record<string, Preset>;

export type PresetName = keyof typeof presets;

export const humanizedPresets = Object.fromEntries(
    Object.entries(presets).map(([key, value]) => {
        const capitalized = key[0]!.toUpperCase() + key.slice(1);

        return [key, `${capitalized} (${value.width}x${value.height}, ${value.mines} mines)`];
    }),
);
