import { digitColors } from '~/utils/colors';
import { type Grid } from '~/utils/grid';
import { cn, twx } from '~/utils/tailwind';
import { type Cell, type Coordinates, type GameStatus } from '~/utils/types';

export const Table = twx.table`border-separate border-spacing-0 overflow-hidden rounded-xl border-2 border-muted`;
export const TableBody = twx.tbody``;
export const TableRow = twx.tr``;
export const TableCell = twx.td`h-10 min-h-[40px] w-10 min-w-[40px] text-center align-middle text-lg font-extrabold transition-colors`;

export const GameCell = ({
    cell,
    coordinates: { x, y },
    grid,
    gameStatus,
    onClick,
    onContextMenu,
}: {
    cell: Cell;
    coordinates: Coordinates;
    gameStatus: GameStatus;
    onClick: () => void;
    onContextMenu: () => void;
    grid: Grid<Cell>;
}) => {
    const isNotTopRow = y !== 0;
    const isNotBottomRow = y !== grid.height - 1;
    const isNotLeftColumn = x !== 0;
    const isNotRightColumn = x !== grid.width - 1;

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
        'select-none',

        isNotTopRow && 'border-t border-muted',
        isNotBottomRow && 'border-b border-muted',
        isNotLeftColumn && 'border-l border-muted',
        isNotRightColumn && 'border-r border-muted',

        isClickable && 'cursor-pointer hover:bg-muted/50 focus:bg-muted/50 active:bg-muted/50',
        isRevealedNumber && `bg-muted/30 ${digitColors[cell.value]}`,
        isRevealedEmpty && 'bg-muted/50',
        isRevealedBomb && !isWrongfullyClicked && 'bg-rose-200 dark:bg-rose-950',
        (isWrongfullyFlagged || isWrongfullyClicked) && 'bg-rose-400 dark:bg-rose-700',
        isTruthfullyFlagged && 'bg-emerald-400 dark:bg-emerald-700',
    );

    return (
        <TableCell
            id={`${x},${y}`}
            className={styles}
            onClick={onClick}
            onContextMenu={(e) => {
                e.preventDefault();
                onContextMenu();
            }}
            onKeyUp={(e) => {
                if (['Enter', ' '].includes(e.key)) onClick();
                if (['F', 'f'].includes(e.key)) onContextMenu();
            }}
            tabIndex={isClickable ? 0 : undefined}
        >
            {content}
        </TableCell>
    );
};
