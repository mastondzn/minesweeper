import { current, type Draft, produce } from 'immer';
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
            return produce(state, (draft) => {
                if (draft.gameStatus !== 'playing') return;

                let cell = draft.grid[y]?.[x];
                if (!cell || cell.flagged) return;

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

                    let regenerate = shouldRegenerate(cell);
                    while (regenerate) {
                        draft.grid = createGrid(presets[draft.settings.preset]);
                        console.log('regenerating grid');
                        cell = draft.grid[y]![x]!;
                        regenerate = shouldRegenerate(cell);
                    }
                }

                cell.visible = true;
                if (cell.type === 'mine') {
                    // we cannot assign to draft and spread to please TS (see below)
                    // https://immerjs.github.io/immer/pitfalls#dont-reassign-the-recipe-argument
                    // @ts-expect-error see above
                    draft.gameStatus = 'lost';
                    // @ts-expect-error see above
                    draft.endedAt = new Date();
                    return;
                } else if (cell.type === 'empty') {
                    draft.grid = updateNeighbors(
                        // we should use current here since passing immer's proxy object is slow, we assign grid here anyway
                        // see https://immerjs.github.io/immer/performance#for-expensive-search-operations-read-from-the-original-state-not-the-draft
                        current(draft).grid,
                        { x, y },
                    );
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
            return produce(state, (draft) => {
                if (draft.gameStatus !== 'playing') return;

                const cell = draft.grid[y]?.[x];

                // TODO: we can make the game not be based on luck here in the future
                if (!cell || cell.visible) return;
                cell.flagged = !cell.flagged;

                if (determineWinCondition(draft.grid)) {
                    // @ts-expect-error ts server cant realize both these are ok
                    draft.gameStatus = 'won';
                    // @ts-expect-error ts server cant realize both these are ok
                    draft.endedAt = new Date();
                }
            });
        });
    },
}));
