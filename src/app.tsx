import { IconBrandGithub, IconMoon, IconSun } from '@tabler/icons-react';
import ConfettiExplosion from 'react-confetti-explosion';

import { Button } from './components/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './components/select';
import { Table, TableBody, TableCell, TableRow } from './components/table';
import { useTheme } from './components/theme-provider';
import { Timer } from './components/timer';
import { useMinesweeper, useMinesweeperCell } from './utils/minesweeper';
import { presets } from './utils/presets';
import { type Coordinates } from './utils/types';

function App() {
    const {
        grid,
        choosePreset,
        reset,
        gameStatus, //
        startedAt,
        endedAt,
        settings,
    } = useMinesweeper();
    const { toggleTheme, theme } = useTheme();

    return (
        <div className="m-4 mx-auto flex min-h-screen flex-col items-center justify-center">
            {gameStatus === 'won' && <ConfettiExplosion />}
            <div className="mx-auto flex flex-col items-center justify-center gap-4">
                <div className="flex flex-row items-center gap-4">
                    <Select
                        defaultValue={settings.preset}
                        onValueChange={(value) => {
                            choosePreset(value as keyof typeof presets);
                        }}
                    >
                        <SelectTrigger className="w-[270px]">
                            <SelectValue placeholder="Change preset" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.entries(presets).map(([name, preset]) => {
                                    return (
                                        <SelectItem key={name} value={name}>
                                            {`${name[0]?.toUpperCase()}${name.slice(1)} (${
                                                preset.width
                                            }x${preset.height}, ${preset.mines} mines)`}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Timer onClick={reset} {...{ gameStatus, startedAt, endedAt }} />
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

                <div className="flex flex-row-reverse gap-2">
                    <Button
                        variant="outline"
                        className="h-fit w-fit rounded-full border-2 p-3"
                        onClick={toggleTheme}
                    >
                        {
                            {
                                light: <IconSun className="h-6 w-6" />,
                                dark: <IconMoon className="h-6 w-6" />,
                            }[theme]
                        }
                    </Button>
                    <Button
                        variant="outline"
                        className="h-fit w-fit rounded-full border-2 p-3"
                        asChild
                    >
                        <a href="https://github.com/mastondzn/minesweeper" target="_blank">
                            <IconBrandGithub className="h-6 w-6" />
                        </a>
                    </Button>
                </div>
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
        return <TableCell {...props}>{cell.value}</TableCell>;
    }

    return (
        <TableCell {...props} className="select-none bg-destructive">
            💣
        </TableCell>
    );
}

export default App;
