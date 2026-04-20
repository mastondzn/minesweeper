import { useKey } from 'react-use';

import { BottomButtons } from './components/button';
import { Count } from './components/counts';
import { PresetPicker } from './components/select';
import { GameCell, Table } from './components/table';
import { Timer } from './components/timer';
import { store, useGame } from './utils/game';
import { useKeyboardNavigation } from './utils/navigation';
import { presets } from './utils/presets';

function App() {
    useKeyboardNavigation();
    useKey(
        (event) => ['r', 'R'].includes(event.key),
        () => store.send({ type: 'restart' }),
    );
    useKey(
        (event) => '123456789'.split('').includes(event.key),
        (event) => {
            const preset = presets.list[Number.parseInt(event.key, 10) - 1]?.name;
            if (preset) store.send({ type: 'choosePreset', preset });
        },
    );

    const grid = useGame((state) => state.context.grid);

    return (
        <div className="mx-auto flex min-h-screen flex-col items-center justify-center">
            <div className="m-4 mx-auto flex flex-col items-center justify-center gap-4">
                <div className="flex w-full flex-row justify-between gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <Timer />
                        <PresetPicker />
                    </div>
                    <Count />
                </div>
                <Table>
                    <tbody>
                        {grid.table.map((row, y) => (
                            <tr key={row[0]?.id ?? y}>
                                {row.map((cell, x) => (
                                    <GameCell key={cell.id} coordinates={{ x, y }} />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <BottomButtons />
            </div>
        </div>
    );
}

export default App;
