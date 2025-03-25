import confetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';
import { isDeepEqual } from 'remeda';

import type { Coordinates } from '~/utils/types';
import { store, useGame } from '~/utils/game';
import { cn, twx } from '~/utils/tailwind';

export const Table = twx.table`border-separate border-spacing-0 overflow-hidden rounded-xl border-2 border-muted`;
export const TableBody = twx.tbody``;
export const TableRow = twx.tr``;
export const TableCell = twx.td`size-[40px] min-h-[40px] min-w-[40px] text-center align-middle text-lg font-extrabold transition-colors`;

const digitColors: Record<number, string> = {
    1: 'text-blue-700 dark:text-blue-400',
    2: 'text-green-700 dark:text-green-400',
    3: 'text-red-700 dark:text-red-400',
    4: 'text-orange-700 dark:text-orange-400',
    5: 'text-yellow-700 dark:text-yellow-400',
    6: 'text-teal-700 dark:text-teal-400',
    7: 'text-fuchsia-700 dark:text-fuchsia-400',
    8: 'text-emerald-700 dark:text-emerald-400',
};

export function GameCell({ coordinates: { x, y } }: { coordinates: Coordinates }) {
    const gameStatus = useGame((state) => state.context.gameStatus);
    const cell = useGame((state) => state.context.grid.at({ x, y }), isDeepEqual);

    const isNotTopRow = y !== 0;
    const isNotBottomRow = useGame((state) => y !== state.context.grid.height - 1);
    const isNotLeftColumn = x !== 0;
    const isNotRightColumn = useGame((state) => x !== state.context.grid.width - 1);

    const isClickable = !cell.clicked && gameStatus === 'playing';
    const isRevealed = cell.clicked || gameStatus !== 'playing';

    const isRevealedEmpty = isRevealed && cell.type === 'empty';
    const isRevealedNumber = isRevealed && cell.type === 'number';
    const isRevealedBomb = isRevealed && cell.type === 'mine';

    const isWrongfullyFlagged = isRevealed && cell.flagged && cell.type !== 'mine';
    const isTruthfullyFlagged = isRevealed && cell.flagged && cell.type === 'mine';
    const isWrongfullyClicked = isRevealed && cell.clicked && cell.type === 'mine';

    const content = cell.flagged
        ? '🚩'
        : isRevealedBomb
          ? '💣'
          : isRevealedNumber
            ? cell.value
            : null;

    const styles = cn(
        {
            'border-t border-muted': isNotTopRow,
            'border-b border-muted': isNotBottomRow,
            'border-l border-muted': isNotLeftColumn,
            'border-r border-muted': isNotRightColumn,

            'cursor-pointer hover:bg-muted/50 focus:bg-muted/50 active:bg-muted/50': isClickable,

            'bg-muted/50': isRevealedEmpty,
            'bg-rose-200 dark:bg-rose-950': isRevealedBomb && !isWrongfullyClicked,
            'bg-rose-400 dark:bg-rose-700': isWrongfullyFlagged || isWrongfullyClicked,
            'bg-emerald-400 dark:bg-emerald-700': isTruthfullyFlagged,
        },
        isRevealedNumber && `bg-muted/30 ${digitColors[cell.value]}`,
        'select-none',
    );

    const previousGameStatus = useRef(gameStatus);
    useEffect(() => {
        previousGameStatus.current = gameStatus;
    }, [gameStatus]);

    return (
        <TableCell
            id={`${x},${y}`}
            className={styles}
            tabIndex={isClickable ? 0 : undefined}
            onClick={({ clientX, clientY }) => {
                store.send({ type: 'click', x, y });

                if (
                    store.getSnapshot().context.gameStatus === 'won' &&
                    previousGameStatus.current !== 'won'
                ) {
                    void confetti({
                        particleCount: 100,
                        startVelocity: 20,
                        gravity: 0.5,
                        spread: 360,
                        origin: {
                            x: clientX / window.innerWidth,
                            y: clientY / window.innerHeight,
                        },
                    });
                }
            }}
            onContextMenu={(event) => {
                event.preventDefault();
                store.send({ type: 'flag', x, y });
            }}
            onKeyUp={(event) => {
                if (['Enter', ' '].includes(event.key)) store.send({ type: 'click', x, y });
                if (['F', 'f'].includes(event.key)) store.send({ type: 'flag', x, y });
            }}
        >
            {content}
        </TableCell>
    );
}
