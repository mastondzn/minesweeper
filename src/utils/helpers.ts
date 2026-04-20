import { uniformInt } from 'pure-rand/distribution/uniformInt';
import { xoroshiro128plus } from 'pure-rand/generator/xoroshiro128plus';

import type { Preset } from './presets';
import type { Cell, Coordinates } from './types';
import { Grid } from './grid';

export function createGrid(
    { height, width, mines }: Preset,
    seed = Date.now() ^ (Math.random() * 0x1_00_00_00_00),
): Grid<Cell> {
    const grid = new Grid<Cell>({
        fill: () => ({ type: 'empty', clicked: false, flagged: false, id: crypto.randomUUID() }),
        width,
        height,
    });

    const rng = xoroshiro128plus(seed);
    function random(max: number) {
        return uniformInt(rng, 0, max - 1);
    }

    // populate mine
    let insertedMines = 0;
    while (insertedMines < mines) {
        const x = random(width);
        const y = random(height);
        if (grid.at({ x, y }).type === 'empty') {
            const { id } = grid.at({ x, y });
            grid.set({ x, y }, { type: 'mine', clicked: false, flagged: false, id });
            insertedMines++;
        }
    }

    // populate mine counts
    for (const { value: cell, x, y } of grid) {
        if (cell.type === 'mine') continue;

        let mines = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                // outside the grid
                if (x + j < 0 || x + j >= width || y + i < 0 || y + i >= height) {
                    continue;
                }

                const cell = grid.at({ x: x + j, y: y + i });
                if (cell.type === 'mine') mines++;
            }
        }

        if (mines === 0) continue;
        const { id } = grid.at({ x, y });
        grid.set({ x, y }, { type: 'number', value: mines, clicked: false, flagged: false, id });
    }

    return grid;
}

export function updateNeighbors(grid: Grid<Cell>, { x, y }: Coordinates) {
    const cell = grid.at({ x, y });

    for (const neighbor of grid.neighbors({ x, y })) {
        const isEmpty = cell.type === 'empty';
        const isNotAMine = neighbor.value.type !== 'mine';
        const isNotVisible = !neighbor.value.clicked;
        const isNotFlagged = !neighbor.value.flagged;

        if (isEmpty && isNotAMine && isNotVisible && isNotFlagged) {
            neighbor.value.clicked = true;
            neighbor.value.flagged = false;
            updateNeighbors(grid, neighbor);
        }
    }

    return grid;
}

export function determineWinCondition(grid: Grid<Cell>) {
    // if every cell that is not a mine is visible, the player wins
    for (const { value: cell } of grid) {
        if (!cell.clicked && cell.type !== 'mine') return false;
    }

    return true;
}
