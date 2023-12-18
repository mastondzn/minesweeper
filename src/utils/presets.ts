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
} satisfies Record<string, Preset>;
