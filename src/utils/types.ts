import type { Grid } from './grid';
import type { PresetName } from './presets';
import type { Settings } from './storage';

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

// eslint-disable-next-line ts/consistent-type-definitions
export type MinesweeperActions = {
    click: Coordinates;
    flag: Coordinates;
    choosePreset: { preset: PresetName };
    restart: Record<never, never>;
};

export type Minesweeper = MinesweeperState & MinesweeperActions;

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
