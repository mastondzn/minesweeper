import { type Draft, produce } from 'immer';
import { create } from 'zustand';

import { createGrid, determineWinCondition, updateNeighbors } from './helpers';
import { type PresetName, presets } from './presets';
import { storage } from './storage';
import { type Cell, type Minesweeper } from './types';

const settings = storage.get('settings');

const resetGame = (draft: Draft<Minesweeper>) => {
    draft.grid = createGrid(presets[draft.settings.preset]);
    draft.gameStatus = 'playing';
    draft.startedAt = null;
    draft.endedAt = null;
};

export const useMinesweeper = create<Minesweeper>()((set) => ({
    settings,
    grid: createGrid(presets[settings.preset]),
    gameStatus: 'playing',
    startedAt: null,
    endedAt: null,
    reset: () => set((state) => produce(state, resetGame)),
    choosePreset: (preset: PresetName) => {
        set((state) => {
            storage.set('settings', { preset });

            return produce(state, (draft) => {
                draft.settings.preset = preset;
                resetGame(draft);
            });
        });
    },
    click: ({ x, y }) => {
        set((state) => {
            if (state.gameStatus !== 'playing') return state;

            return produce(state, (draft) => {
                let cell = draft.grid.at({ x, y });
                if (cell.flagged) return;

                if (!draft.startedAt) {
                    draft.startedAt = new Date();
                    const directive = draft.settings.startDirective;

                    const shouldRegenerate = (cell: Cell) => {
                        return directive === 'empty'
                            ? cell.type !== 'empty'
                            : directive === 'numberOrEmpty'
                              ? cell.type !== 'mine'
                              : false;
                    };

                    while (shouldRegenerate(cell)) {
                        draft.grid = createGrid(presets[draft.settings.preset]);
                        console.log('regenerating grid');
                        cell = draft.grid.at({ x, y });
                    }
                }

                cell.clicked = true;
                if (cell.type === 'mine') {
                    // we cannot assign to draft and spread to please TS (see below)
                    // https://immerjs.github.io/immer/pitfalls#dont-reassign-the-recipe-argument
                    // @ts-expect-error see above
                    draft.gameStatus = 'lost';
                    // @ts-expect-error see above
                    draft.endedAt = new Date();
                    return;
                } else if (cell.type === 'empty') {
                    updateNeighbors(draft.grid, { x, y });
                }

                if (determineWinCondition(draft.grid)) {
                    // @ts-expect-error see above
                    draft.gameStatus = 'won';
                    // @ts-expect-error see above
                    draft.endedAt = new Date();
                }
            });
        });
    },
    flag: ({ x, y }) => {
        set((state) => {
            if (state.gameStatus !== 'playing') return state;

            return produce(state, (draft) => {
                const cell = draft.grid.at({ x, y });

                // TODO: we can make the game not be based on luck here in the future
                if (cell.clicked) return;
                cell.flagged = !cell.flagged;

                if (determineWinCondition(draft.grid)) {
                    // @ts-expect-error see above
                    draft.gameStatus = 'won';
                    // @ts-expect-error see above
                    draft.endedAt = new Date();
                }
            });
        });
    },
}));
