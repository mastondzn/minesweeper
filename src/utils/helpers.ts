import { Grid } from './grid';
import type { Preset } from './presets';
import type { Cell, Coordinates } from './types';

export function createGrid({ height, width, mines }: Preset): Grid<Cell> {
    const grid = new Grid<Cell>({
        fill: () => ({ type: 'empty', clicked: false, flagged: false }),
        width,
        height,
    });

    // populate mine
    let insertedMines = 0;
    while (insertedMines < mines) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        if (grid.at({ x, y }).type === 'empty') {
            grid.set({ x, y }, { type: 'mine', clicked: false, flagged: false });
            insertedMines++;
        }
    }

    // populate mine counts
    for (const { value: cell, x, y } of grid) {
        if (cell.type === 'mine')
            continue;

        let mines = 0;
        for (let index = -1; index <= 1; index++) {
            for (let index_ = -1; index_ <= 1; index_++) {
                // outside the grid
                if (x + index_ < 0 || x + index_ >= width || y + index < 0 || y + index >= height)
                    continue;

                const cell = grid.at({ x: x + index_, y: y + index });
                if (cell.type === 'mine')
                    mines++;
            }
        }

        if (mines === 0)
            continue;
        grid.set({ x, y }, { type: 'number', value: mines, clicked: false, flagged: false });
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
        if (!cell.clicked && cell.type !== 'mine')
            return false;
    }

    return true;
}
