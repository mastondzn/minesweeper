import { type SnapshotFromStore, createStoreWithProducer } from '@xstate/store';
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
            storage.set('settings', { preset: event.preset });
            restart(ctx);
        },
        click: (ctx, { x, y }): void => {
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
                // @ts-expect-error due to union type ts doesn't know we assign both
                ctx.gameStatus = 'lost';
                // @ts-expect-error due to union type ts doesn't know we assign both
                ctx.endedAt = new Date();
                return;
            } else if (cell.type === 'empty') {
                updateNeighbors(ctx.grid, { x, y });
            }

            if (determineWinCondition(ctx.grid)) {
                // @ts-expect-error due to union type ts doesn't know we assign both
                ctx.gameStatus = 'won';
                // @ts-expect-error due to union type ts doesn't know we assign both
                ctx.endedAt = new Date();
            }
        },
        flag: (ctx, { x, y }): void => {
            if (ctx.gameStatus !== 'playing' || !ctx.startedAt) return;

            const cell = ctx.grid.at({ x, y });

            if (!cell.clicked) cell.flagged = !cell.flagged;
        },
    },
);

export function useGame<T>(
    selector: (snapshot: SnapshotFromStore<typeof store>) => T,
    compare?: (a: T | undefined, b: T) => boolean,
) {
    return useSelector<typeof store, T>(store, selector, compare);
}
