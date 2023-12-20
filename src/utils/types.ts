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

export interface Settings {
    preset: keyof typeof presets;
    startDirective: 'none' | 'empty' | 'numberOrEmpty';
}

export type MinesweeperState = {
    settings: Settings;
    grid: Cell[][];
} & (
    | {
          startedAt: Date;
          endedAt: Date;
          gameStatus: 'won' | 'lost';
      }
    | {
          startedAt: null | Date;
          endedAt: null;
          gameStatus: 'playing';
      }
);

export interface MinesweeperActions {
    click: ({ x, y }: Coordinates) => void;
    flag: ({ x, y }: Coordinates) => void;
    choosePreset: (preset: keyof typeof presets) => void;
    reset: () => void;
}

export type Minesweeper = MinesweeperState & MinesweeperActions;

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
