import ConfettiExplosion from 'react-confetti-explosion';

import { BottomButtons } from './components/button';
import { PresetPicker } from './components/select';
import { Table, TableBody, TableCell, TableRow } from './components/table';
import { Timer } from './components/timer';
import { cn } from './utils/classnames';
import { digitColors } from './utils/colors';
import { useKeyPress } from './utils/hooks';
import { useMinesweeper, useMinesweeperCell } from './utils/minesweeper';
import { type Coordinates } from './utils/types';

function App() {
    const {
        grid, //
        choosePreset,
        reset,
        gameStatus,
        startedAt,
        endedAt,
        settings,
    } = useMinesweeper();
    useKeyPress('r', { onDown: reset });

    return (
        <div className="mx-auto flex min-h-screen flex-col items-center justify-center">
            {gameStatus === 'won' && <ConfettiExplosion />}
            <div className="m-4 mx-auto flex flex-col items-center justify-center gap-4">
                <div className="flex flex-row items-center gap-4">
                    <Timer onClick={reset} {...{ gameStatus, startedAt, endedAt }} />
                    <PresetPicker defaultValue={settings.preset} onValueChange={choosePreset} />
                </div>

                <Table>
                    <TableBody>
                        {grid.map((row, y) => (
                            <TableRow key={y}>
                                {row.map((_cell, x) => (
                                    <GameCell key={`${x},${y}`} coords={{ x, y }} />
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <BottomButtons />
            </div>
        </div>
    );
}

function GameCell({ coords }: { coords: Coordinates }) {
    const { cell, click, flag, gameStatus } = useMinesweeperCell(coords);

    const props = {
        onClick: () => {
            click();
        },
        onContextMenu: (e: React.MouseEvent<HTMLTableCellElement>) => {
            e.preventDefault();
            flag();
        },
        className: 'select-none',
    } satisfies React.TdHTMLAttributes<HTMLTableCellElement>;

    if (cell.flagged && gameStatus !== 'lost') {
        return <TableCell {...props}>🚩</TableCell>;
    }

    if (!cell.visible && gameStatus !== 'lost') {
        return <TableCell {...props} />;
    }

    if (cell.type === 'empty') {
        return <TableCell {...props} className="bg-muted/100 dark:bg-muted/60" />;
    }

    if (cell.type === 'number') {
        return (
            <TableCell {...props} className={cn(digitColors[cell.value])}>
                {cell.value}
            </TableCell>
        );
    }

    return (
        <TableCell {...props} className="select-none bg-destructive">
            💣
        </TableCell>
    );
}

export default App;
