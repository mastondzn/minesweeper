import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createGrid, determineWinCondition, updateNeighbors } from './helpers';
import { type PresetName, presets } from './presets';
import { storage } from './storage';
import { type Cell, type Coordinates, type Minesweeper, type MinesweeperState } from './types';

const settings = storage.get('settings');

// ts server donking up here for some reason
export const useMinesweeper = create<Minesweeper>()(
    immer((set) => ({
        settings,
        grid: createGrid(presets[settings.preset]),
        gameStatus: 'playing',
        startedAt: null,
        endedAt: null,
        choosePreset: (preset: PresetName) => {
            set((state: MinesweeperState) => {
                storage.set('settings', { preset });
                state.settings.preset = preset;
                state.grid = createGrid(presets[state.settings.preset]);
                state.gameStatus = 'playing';
                state.startedAt = null;
                state.endedAt = null;
            });
        },
        reset: () => {
            set((state: MinesweeperState) => {
                state.grid = createGrid(presets[state.settings.preset]);
                state.gameStatus = 'playing';
                state.startedAt = null;
                state.endedAt = null;
            });
        },
        click: ({ x, y }) => {
            set((state: MinesweeperState) => {
                if (state.gameStatus !== 'playing') return;

                let cell = state.grid[y]?.[x];
                if (!cell) throw new Error('Cell does not exist');
                if (cell.flagged) return; // must not be flagged to be clicked

                if (!state.startedAt) {
                    state.startedAt = new Date();
                    const directive = state.settings.startDirective;

                    const shouldRegenerate = (cell: Cell) => {
                        return directive === 'empty'
                            ? cell.type !== 'empty'
                            : directive === 'numberOrEmpty'
                              ? cell.type !== 'mine'
                              : false;
                    };

                    let regenerate = shouldRegenerate(cell);
                    while (regenerate) {
                        state.grid = createGrid(presets[state.settings.preset]);
                        console.log('regenerating grid');
                        cell = state.grid[y]?.[x];
                        if (!cell) throw new Error('Cell does not exist');
                        regenerate = shouldRegenerate(cell);
                    }
                }

                cell.visible = true;
                if (cell.type === 'mine') {
                    // @ts-expect-error ts server cant realize both these are ok
                    state.gameStatus = 'lost';
                    // @ts-expect-error ts server cant realize both these are ok
                    state.endedAt = new Date();
                    return;
                } else if (cell.type === 'empty') {
                    state.grid = updateNeighbors(state.grid, { x, y });
                }

                if (determineWinCondition(state.grid)) {
                    // @ts-expect-error ts server cant realize both these are ok
                    state.gameStatus = 'won';
                    // @ts-expect-error ts server cant realize both these are ok
                    state.endedAt = new Date();
                }
            });
        },
        flag: ({ x, y }) => {
            set((state: MinesweeperState) => {
                if (state.gameStatus !== 'playing') return;
                // TODO: we can make the game not be based on luck here in the future
                const cell = state.grid[y]?.[x];
                if (!cell) throw new Error('Cell does not exist');
                if (cell.visible) return;
                cell.flagged = !cell.flagged;

                if (determineWinCondition(state.grid)) {
                    // @ts-expect-error ts server cant realize both these are ok
                    state.gameStatus = 'won';
                    // @ts-expect-error ts server cant realize both these are ok
                    state.endedAt = new Date();
                }
            });
        },
    })),
);

export const useMinesweeperCell = ({ x, y }: Coordinates) => {
    return useMinesweeper((state) => {
        const cell = state.grid[y]?.[x];
        if (!cell) throw new Error('Cell does not exist');

        return {
            cell,
            gameStatus: state.gameStatus,
            click: () => {
                state.click({ x, y });
            },
            flag: () => {
                state.flag({ x, y });
            },
        };
    });
};
