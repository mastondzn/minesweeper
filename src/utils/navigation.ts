import { useKey } from 'react-use';

import type { Grid } from './grid';
import type { Cell, Coordinates, GameStatus } from './types';

function getFocusedCell(): Coordinates | null {
    const coordinates = document.activeElement?.id
        .split(',')
        .map(coord => Number.parseInt(coord, 10));

    const x = coordinates?.[0];
    const y = coordinates?.[1];

    if (typeof x !== 'number' || typeof y !== 'number')
        return null;

    return { x, y };
}

let lastFocusedCell: Coordinates | null = null;

function focus({ x, y }: Coordinates) {
    // eslint-disable-next-line unicorn/prefer-query-selector
    const cell = document.getElementById(`${x},${y}`);
    if (cell instanceof HTMLElement) {
        lastFocusedCell = { x, y };
        cell.focus();
    }
}

function isFocusable(cell: Cell) {
    return !cell.clicked;
}

const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const;

export function useKeyboardNavigation({
    gameStatus,
    grid,
}: {
    gameStatus: GameStatus
    grid: Grid<Cell>
}) {
    useKey(
        event => keys.includes(event.key as (typeof keys)[number]),
        (event) => {
            if (gameStatus !== 'playing')
                return;

            const key = event.key as (typeof keys)[number];

            const last = getFocusedCell() ?? lastFocusedCell;
            if (!last) {
                const first = grid.find(cell => isFocusable(cell));
                if (first)
                    focus(first.coordinates);
                return;
            }

            const cellGetters = {
                ArrowUp: () => grid.getAbove(last),
                ArrowDown: () => grid.getBelow(last),
                ArrowRight: () => grid.getRight(last),
                ArrowLeft: () => grid.getLeft(last),
            };

            const cells = cellGetters[key]();

            const index = ['ArrowUp', 'ArrowLeft'].includes(key)
                ? cells.reverse().findIndex(cell => isFocusable(cell))
                : cells.findIndex(cell => isFocusable(cell));

            if (index === -1)
                return;

            const coordinatesByKey = {
                ArrowUp: { x: last.x, y: last.y - index - 1 },
                ArrowDown: { x: last.x, y: last.y + index + 1 },
                ArrowLeft: { x: last.x - index - 1, y: last.y },
                ArrowRight: { x: last.x + index + 1, y: last.y },
            };

            focus(coordinatesByKey[key]);
        },
    );
}
