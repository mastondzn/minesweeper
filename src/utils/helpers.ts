import { type Cell, type Coordinates, type Preset } from './types';

export const createGrid = ({ height, width, mines }: Preset): Cell[][] => {
    const grid: Cell[][] = new Array(height)
        .fill(null)
        .map(() =>
            new Array(width)
                .fill(null)
                .map(() => ({ type: 'empty', visible: false, flagged: false })),
        );

    // populate bombs
    let insertedBombs = 0;
    while (insertedBombs < mines) {
        const y = Math.floor(Math.random() * height);
        const x = Math.floor(Math.random() * width);
        if (grid[y]![x]!.type === 'empty') {
            grid[y]![x] = { type: 'mine', visible: false, flagged: false };
            insertedBombs++;
        }
    }

    // populate mine counts
    for (const [y, row] of grid.entries()) {
        for (const [x, cell] of row.entries()) {
            if (cell.type === 'mine') continue;

            let mines = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    // outside the grid
                    if (x + j < 0 || x + j >= width || y + i < 0 || y + i >= height) {
                        continue;
                    }

                    const cell = grid[y + i]?.[x + j];
                    if (cell?.type === 'mine') {
                        mines++;
                    }
                }
            }

            if (mines === 0) continue;

            grid[y]![x] = { type: 'number', value: mines, visible: false, flagged: false };
        }
    }

    return grid;
};

export const updateNeighbors = (grid: Cell[][], { x, y }: Coordinates) => {
    const height = grid.length;
    const width = grid[0]!.length;

    for (const dy of [-1, 0, 1]) {
        for (const dx of [-1, 0, 1]) {
            if (dx === 0 && dy === 0) continue;

            const newY = y + dy;
            const newX = x + dx;

            const isInBounds = newY < height && newX < width && newY >= 0 && newX >= 0;
            const isEmpty = grid[y]?.[x]?.type === 'empty';
            const isNotAMine = grid[newY]?.[newX]?.type !== 'mine';
            const isNotVisible = grid[newY]?.[newX]?.visible === false;
            const isNotFlagged = grid[newY]?.[newX]?.flagged === false;

            if (isInBounds && isEmpty && isNotAMine && isNotVisible && isNotFlagged) {
                grid[newY]![newX]!.visible = true;
                grid[newY]![newX]!.flagged = false;
                updateNeighbors(grid, { y: newY, x: newX });
            }
        }
    }

    return grid;
};

export const determineWinCondition = (grid: Cell[][]) => {
    return grid.every((row) =>
        row.every((cell) => {
            if (cell.type === 'mine') return cell.flagged;
            return cell.visible;
        }),
    );
};
