import ConfettiExplosion from 'react-confetti-explosion';

import { BottomButtons } from './components/button';
import { Count } from './components/counts';
import { PresetPicker } from './components/select';
import { GameCell, Table, TableBody, TableRow } from './components/table';
import { Timer } from './components/timer';
import { useKeyPress } from './utils/hooks';
import { useMinesweeper } from './utils/minesweeper';

function App() {
    const {
        grid, //
        gameStatus,
        settings,
        startedAt,
        endedAt,
        choosePreset,
        reset,
        click,
        flag,
    } = useMinesweeper();
    useKeyPress('r', { onUp: reset });

    return (
        <div className="mx-auto flex min-h-screen flex-col items-center justify-center">
            {gameStatus === 'won' && <ConfettiExplosion />}
            <div className="m-4 mx-auto flex flex-col items-center justify-center gap-4">
                <div className="flex w-full flex-row justify-between gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <Timer onClick={reset} {...{ gameStatus, startedAt, endedAt }} />
                        <PresetPicker defaultValue={settings.preset} onValueChange={choosePreset} />
                    </div>
                    <Count grid={grid} preset={settings.preset} />
                </div>

                <Table>
                    <TableBody>
                        {grid.table.map((row, y) => (
                            <TableRow key={y}>
                                {row.map((cell, x) => (
                                    <GameCell
                                        key={`${x},${y}`}
                                        cell={cell}
                                        coordinates={{ x, y }}
                                        gameStatus={gameStatus}
                                        onClick={() => {
                                            throw new Error('test sentry');
                                        }}
                                        onContextMenu={() => flag({ x, y })}
                                        grid={grid}
                                    />
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

export default App;
