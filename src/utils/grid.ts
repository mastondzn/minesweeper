import { immerable } from 'immer';

import { type Coordinates } from './types';

export class Grid<T> {
    public table: T[][];
    public readonly width: number;
    public readonly height: number;
    [immerable] = true;

    constructor({ fill, width, height }: { fill: () => T; width: number; height: number }) {
        this.table = new Array(height)
            .fill(null)
            .map(() => new Array(width).fill(null).map(() => fill()));

        this.width = width;
        this.height = height;
    }

    *[Symbol.iterator]() {
        for (const [y, row] of this.table.entries()) {
            for (const [x, value] of row.entries()) {
                yield { value, x, y };
            }
        }
    }

    *neighbors({ x, y }: Coordinates, diagonals = true) {
        for (const dy of [-1, 0, 1]) {
            for (const dx of [-1, 0, 1]) {
                if (dx === 0 && dy === 0) continue;
                if (!diagonals && dx !== 0 && dy !== 0) continue;

                const neighbor = {
                    x: x + dx,
                    y: y + dy,
                };

                if (!this.isInBounds(neighbor)) continue;

                let place = '';
                if (dy === -1) place += 't';
                if (dy === 0) place += 'm';
                if (dy === 1) place += 'b';
                if (dx === -1) place += 'l';
                if (dx === 0) place += 'm';
                if (dx === 1) place += 'r';

                yield {
                    value: this.at(neighbor),
                    place: place as `${'t' | 'm' | 'b'}${'l' | 'm' | 'r'}`,
                    ...neighbor,
                };
            }
        }
    }

    public at({ x, y }: Coordinates): T {
        const value = this.table[y]?.[x];
        if (value === undefined) throw new Error(`Grid index out of bounds: ${x}, ${y}`);
        return value;
    }

    public set({ x, y }: Coordinates, value: T): void {
        if (!this.isInBounds({ x, y })) throw new Error(`Grid index out of bounds: ${x}, ${y}`);
        this.table[y]![x] = value;
    }

    public isInBounds({ x, y }: Coordinates): boolean {
        return y < this.height && x < this.width && y >= 0 && x >= 0;
    }
}