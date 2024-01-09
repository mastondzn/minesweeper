import { type Grid } from './grid';
import { type PresetName } from './presets';
import { type Settings } from './storage';

export interface Coordinates {
    x: number;
    y: number;
}

export type Cell = (
    | { type: 'mine' | 'empty' } //
    | { type: 'number'; value: number }
) & {
    flagged: boolean;
    clicked: boolean;
};

export type MinesweeperState = {
    settings: Settings;
    grid: Grid<Cell>;
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

export type GameStatus = MinesweeperState['gameStatus'];

export interface MinesweeperActions {
    click: ({ x, y }: Coordinates) => void;
    flag: ({ x, y }: Coordinates) => void;
    choosePreset: (preset: PresetName) => void;
    reset: () => void;
}

export type Minesweeper = MinesweeperState & MinesweeperActions;

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
