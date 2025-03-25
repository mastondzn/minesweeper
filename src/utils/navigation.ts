import { useKey } from 'react-use';

import type { Cell, Coordinates } from './types';
import { store } from './game';

function getFocusedCell(): Coordinates | null {
    const coordinates = document.activeElement?.id
        .split(',')
        .map((coord) => Number.parseInt(coord, 10));

    const x = coordinates?.[0];
    const y = coordinates?.[1];

    if (typeof x !== 'number' || typeof y !== 'number') return null;

    return { x, y };
}

let lastFocusedCell: Coordinates | null = null;

function focus({ x, y }: Coordinates) {
    // eslint-disable-next-line unicorn/prefer-query-selector
    const cell = document.getElementById(`${x},${y}`);
    if (cell) {
        lastFocusedCell = { x, y };
        cell.focus();
    }
}

function isFocusable(cell: Cell) {
    return !cell.clicked;
}

const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const;

export function useKeyboardNavigation() {
    useKey(
        (event) => keys.includes(event.key as (typeof keys)[number]),
        (event) => {
            const { context } = store.getSnapshot();

            if (context.gameStatus !== 'playing') return;

            const key = event.key as (typeof keys)[number];

            const last = getFocusedCell() ?? lastFocusedCell;
            if (!last) {
                const first = context.grid.find((cell) => isFocusable(cell));
                if (first) focus(first.coordinates);
                return;
            }

            const cells = {
                ArrowUp: () => context.grid.getAbove(last),
                ArrowDown: () => context.grid.getBelow(last),
                ArrowRight: () => context.grid.getRight(last),
                ArrowLeft: () => context.grid.getLeft(last),
            }[key]();

            const index = ['ArrowUp', 'ArrowLeft'].includes(key)
                ? cells.reverse().findIndex((cell) => isFocusable(cell))
                : cells.findIndex((cell) => isFocusable(cell));

            if (index === -1) return;

            const coordinates = {
                ArrowUp: { x: last.x, y: last.y - index - 1 },
                ArrowDown: { x: last.x, y: last.y + index + 1 },
                ArrowLeft: { x: last.x - index - 1, y: last.y },
                ArrowRight: { x: last.x + index + 1, y: last.y },
            }[key];

            focus(coordinates);
        },
    );
}
