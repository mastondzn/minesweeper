import ConfettiExplosion from 'react-confetti-explosion';
import { useKey } from 'react-use';

import { BottomButtons } from './components/button';
import { Count } from './components/counts';
import { PresetPicker } from './components/select';
import { GameCell, Table, TableBody, TableRow } from './components/table';
import { Timer } from './components/timer';
import { store, useGame } from './utils/minesweeper';
import { useKeyboardNavigation } from './utils/navigation';
import { presets } from './utils/presets';

function App() {
    const { grid, gameStatus, settings, endedAt, startedAt } = useGame();

    useKeyboardNavigation({ gameStatus, grid });
    useKey(
        (event) => ['r', 'R'].includes(event.key),
        () => store.send({ type: 'restart' }),
    );
    useKey(
        (event) => [...'123456789'].includes(event.key),
        (event) => {
            const preset = presets.list[Number.parseInt(event.key, 10) - 1]?.name;
            if (preset) store.send({ type: 'choosePreset', preset });
        },
    );

    return (
        <div className="mx-auto flex min-h-screen flex-col items-center justify-center">
            {gameStatus === 'won' && <ConfettiExplosion />}
            <div className="m-4 mx-auto flex flex-col items-center justify-center gap-4">
                <div className="flex w-full flex-row justify-between gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <Timer
                            {...{ gameStatus, startedAt, endedAt }}
                            onClick={() => store.send({ type: 'restart' })}
                        />
                        <PresetPicker
                            defaultValue={settings.preset}
                            onValueChange={(preset) => store.send({ type: 'choosePreset', preset })}
                        />
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
                                        onClick={() => store.send({ type: 'click', x, y })}
                                        onContextMenu={() => store.send({ type: 'flag', x, y })}
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
