import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createGrid, determineWinCondition, updateNeighbors } from './helpers';
import { presets } from './presets';
import { type Coordinates, type MinesweeperActions, type MinesweeperState } from './types';

export const useMinesweeper = create<MinesweeperState & MinesweeperActions>()(
    immer((set) => ({
        presets: presets,
        preset: presets.beginner,
        grid: createGrid(presets.beginner),
        gameStatus: 'playing',
        firstClick: false,
        choosePreset: (preset) => {
            set((state: MinesweeperState) => {
                state.preset = preset;
                state.grid = createGrid(preset);
                state.gameStatus = 'playing';
                state.firstClick = false;
            });
        },
        reset: () => {
            set((state: MinesweeperState) => {
                state.gameStatus = 'playing';
                state.grid = createGrid(state.preset);
                state.firstClick = false;
            });
        },
        click: ({ x, y }) => {
            set((state: MinesweeperState) => {
                if (state.gameStatus !== 'playing') return;

                const cell = state.grid[y]?.[x];
                if (!cell) throw new Error('Cell does not exist');
                if (cell.flagged) return; // must not be flagged to be clicked

                state.firstClick = true;
                cell.visible = true;
                if (cell.type === 'mine') {
                    state.gameStatus = 'lost';
                    return;
                } else if (cell.type === 'empty') {
                    state.grid = updateNeighbors(state.grid, { x, y });
                }

                if (determineWinCondition(state.grid)) {
                    state.gameStatus = 'won';
                }
            });
        },
        flag: ({ x, y }) => {
            set((state: MinesweeperState) => {
                if (state.gameStatus !== 'playing') return;
                // TODO: we can make the game not be based on luck here in the future
                const cell = state.grid[y]?.[x];
                if (!cell) throw new Error('Cell does not exist');
                if (cell.visible) return;
                cell.flagged = !cell.flagged;
            });
        },
    })),
);

export const useMinesweeperCell = ({ x, y }: Coordinates) => {
    return useMinesweeper((state) => {
        const cell = state.grid[y]?.[x];
        if (!cell) throw new Error('Cell does not exist');

        return {
            cell,
            gameStatus: state.gameStatus,
            click: () => {
                state.click({ x, y });
            },
            flag: () => {
                state.flag({ x, y });
            },
        };
    });
};

export const useTimer = () => {
    const { gameStatus, firstClick } = useMinesweeper(({ gameStatus, firstClick }) => ({
        gameStatus,
        firstClick,
    }));
    const [milliseconds, setMilliseconds] = useState(0);

    useEffect(() => {
        if (gameStatus === 'playing' && firstClick) {
            const interval = setInterval(() => {
                setMilliseconds((time) => time + 100);
            }, 100);
            return () => {
                clearInterval(interval);
            };
        }

        if (gameStatus === 'playing') {
            setMilliseconds(0);
        }
    }, [gameStatus, firstClick]);

    return { milliseconds: milliseconds, gameStatus, firstClick };
};
