import { type PresetName, presets } from '~/utils/presets';
import { type Cell } from '~/utils/types';

export const Count = ({ grid, preset }: { grid: Cell[][]; preset: PresetName }) => {
    let flagged = 0;

    for (const row of grid) {
        for (const cell of row) {
            if (cell.flagged) flagged++;
        }
    }

    const { mines } = presets[preset];

    return (
        <div
            title={`${flagged}/${mines} 🚩`}
            className="flex flex-row items-center gap-4 rounded-md border-2 pl-3 pr-1.5"
        >
            <p className="text-center text-lg font-semibold tabular-nums">
                {flagged} / {mines} 🚩
            </p>
        </div>
    );
};
