import { createStoreWithProducer } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { produce } from 'immer';

import { createGrid, determineWinCondition, restart, updateNeighbors } from './helpers';
import { type PresetName, presets } from './presets';
import { storage } from './storage';
import type { Cell, MinesweeperActions, MinesweeperState } from './types';

const settings = storage.get('settings');

export const store = createStoreWithProducer<MinesweeperState, MinesweeperActions>(
    produce,
    {
        settings,
        grid: createGrid(presets.get(settings.preset)),
        gameStatus: 'playing',
        startedAt: null,
        endedAt: null,
    },
    {
        restart: (ctx): void => restart(ctx),
        choosePreset: (ctx, event: { preset: PresetName }): void => {
            ctx.settings.preset = event.preset;
            restart(ctx);
        },
        click: (ctx, { x, y }: { x: number; y: number }): void => {
            if (ctx.gameStatus !== 'playing') return;

            let cell = ctx.grid.at({ x, y });
            if (cell.flagged) return;

            if (!ctx.startedAt) {
                ctx.startedAt = new Date();
                const directive = ctx.settings.startDirective;

                const shouldRegenerate = (cell: Cell) => {
                    return directive === 'empty'
                        ? cell.type !== 'empty'
                        : directive === 'numberOrEmpty'
                          ? cell.type !== 'mine'
                          : false;
                };

                while (shouldRegenerate(cell)) {
                    ctx.grid = createGrid(presets.get(ctx.settings.preset));
                    cell = ctx.grid.at({ x, y });
                }
            }

            cell.clicked = true;
            if (cell.type === 'mine') {
                Object.assign(ctx, { gameStatus: 'lost', endedAt: new Date() });
                return;
            } else if (cell.type === 'empty') {
                updateNeighbors(ctx.grid, { x, y });
            }

            if (determineWinCondition(ctx.grid)) {
                Object.assign(ctx, {
                    gameStatus: 'won',
                    endedAt: new Date(),
                });
            }
        },
        flag: (ctx, { x, y }: { x: number; y: number }): void => {
            if (ctx.gameStatus !== 'playing') return;

            const cell = ctx.grid.at({ x, y });

            // TODO: we can make the game not be based on luck here in the future
            if (cell.clicked) return;
            cell.flagged = !cell.flagged;

            if (determineWinCondition(ctx.grid)) {
                // @ts-expect-error we cannot assign to draft directly and spread to please TS
                ctx.gameStatus = 'won';
                // @ts-expect-error we cannot assign to draft directly and spread to please TS
                ctx.endedAt = new Date();
            }
        },
    },
);

export function useGame() {
    return useSelector(store, (state) => state.context);
}

export function useGameStatus() {
    return useSelector(store, (state) => ({
        gameStatus: state.context.gameStatus,
        endedAt: state.context.endedAt,
        startedAt: state.context.startedAt,
    }));
}

export function usePreset() {
    return useSelector(store, (state) => state.context.settings.preset);
}
