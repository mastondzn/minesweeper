import { type presets } from './presets';

export interface Preset {
    width: number;
    height: number;
    mines: number;
}

export interface Coordinates {
    x: number;
    y: number;
}

export type Cell = (
    | { type: 'mine' } //
    | { type: 'number'; value: number }
    | { type: 'empty' }
) & {
    flagged: boolean;
    visible: boolean;
};

export interface MinesweeperState {
    presets: typeof presets;
    preset: Preset;
    grid: Cell[][];
    firstClick: boolean;
    gameStatus: 'won' | 'lost' | 'playing';
}

export interface MinesweeperActions {
    click: ({ x, y }: Coordinates) => void;
    flag: ({ x, y }: Coordinates) => void;
    reset: () => void;
    choosePreset: (preset: Preset) => void;
}
