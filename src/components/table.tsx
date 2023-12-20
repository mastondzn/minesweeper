import * as React from 'react';

import { cn } from '~/utils/classnames';
import { digitColors } from '~/utils/colors';
import { type Cell, type Coordinates } from '~/utils/types';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className="relative overflow-auto">
            <table
                ref={ref}
                className={cn(
                    'border-separate border-spacing-0 overflow-hidden rounded-xl border-2 border-muted text-sm',
                    className,
                )}
                {...props}
            />
        </div>
    ),
);

export const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <tbody ref={ref} className={className} {...props} />);

export const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => <tr ref={ref} className={className} {...props} />);

export const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            'h-10 min-h-[40px] w-10 min-w-[40px] text-center align-middle text-lg font-extrabold transition-colors',
            className,
        )}
        {...props}
    />
));

export const GameCell = ({
    cell,
    coordinates,
    size,
    gameStatus,
    onClick,
    onContextMenu,
}: {
    cell: Cell;
    coordinates: Coordinates;
    gameStatus: 'playing' | 'won' | 'lost';
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent<HTMLTableCellElement>) => void;
    size: { width: number; height: number };
}) => {
    // very bad logic!!

    const content =
        cell.flagged && gameStatus !== 'lost'
            ? '🚩'
            : !cell.visible && gameStatus !== 'lost'
              ? null
              : cell.type === 'number'
                ? cell.value
                : cell.type === 'mine'
                  ? '💣'
                  : null;

    const className = cn(
        'select-none',

        // is not last columns
        coordinates.x !== size.width - 1 && 'border-r-2 border-muted',
        // is not last row
        coordinates.y !== size.height - 1 && 'border-b-2 border-muted',

        cell.type === 'empty' && (cell.visible || gameStatus === 'lost')
            ? 'bg-stripes-muted'
            : 'hover:bg-slate-400/30 dark:hover:bg-slate-300/20',
        cell.type === 'mine' &&
            gameStatus === 'lost' &&
            'bg-red-500 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-300',
        cell.type === 'number' && digitColors[cell.value],
    );

    return <TableCell {...{ onClick, onContextMenu, className }}>{content}</TableCell>;
};
