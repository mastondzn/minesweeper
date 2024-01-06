import { immerable } from 'immer';

import { type Coordinates } from './types';

export class Grid<T> {
    public table: T[][];
    public readonly width: number;
    public readonly height: number;
    [immerable] = true;

    constructor({
        fill,
        width,
        height,
    }: {
        fill: ({ x, y }: Coordinates) => T;
        width: number;
        height: number;
    }) {
        this.table = new Array(height)
            .fill(null)
            .map((_, y) => new Array(width).fill(null).map((_, x) => fill({ x, y })));

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

    public find(
        predicate: (value: T, coords: Coordinates) => unknown,
    ): { value: T; coordinates: Coordinates } | null {
        for (const { value, x, y } of this) {
            if (predicate(value, { x, y })) return { value, coordinates: { x, y } };
        }
        return null;
    }

    public findReverse(
        predicate: (value: T, coords: Coordinates) => unknown,
    ): { value: T; coordinates: Coordinates } | null {
        for (let y = this.table.length; y >= 0; y--) {
            const element = this.table[y];
            if (!element) continue;
            for (let x = element.length; x >= 0; x--) {
                const value = element[x];
                if (!value) continue;
                if (predicate(value, { x, y })) return { value, coordinates: { x, y } };
            }
        }
        return null;
    }

    public getColumn(x: number): T[] {
        return this.table.map((row) => row[x]!);
    }

    public getRow(y: number): T[] {
        return this.table[y]!;
    }

    public getAbove({ x, y }: Coordinates): T[] {
        return this.table.slice(0, y).map((row) => row[x]!);
    }

    public getBelow({ x, y }: Coordinates): T[] {
        return this.table.slice(y + 1).map((row) => row[x]!);
    }

    public getLeft({ x, y }: Coordinates): T[] {
        return this.table[y]!.slice(0, x);
    }

    public getRight({ x, y }: Coordinates): T[] {
        return this.table[y]!.slice(x + 1);
    }

    // subgrid({ from, to }: { from: Coordinates; to: Coordinates }): Grid<T> {
    //     const width = to.x - from.x + 1;
    //     const height = to.y - from.y + 1;

    //     return new Grid({
    //         width,
    //         height,
    //         fill: (coords) => {
    //             return this.at({
    //                 x: coords.x + from.x,
    //                 y: coords.y + from.y,
    //             });
    //         },
    //     });
    // }
}
