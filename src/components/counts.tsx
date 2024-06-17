import type { Grid } from '~/utils/grid';
import { type PresetName, presets } from '~/utils/presets';
import type { Cell } from '~/utils/types';

export function Count({ grid, preset }: { grid: Grid<Cell>, preset: PresetName }) {
    let flagged = 0;

    for (const { value: cell } of grid) {
        if (cell.flagged)
            flagged++;
    }

    const { mines } = presets.get(preset);

    return (
        <div className="flex flex-row items-center gap-4 rounded-md border-2 pl-3 pr-1.5">
            <p className="whitespace-nowrap text-center text-lg font-semibold tabular-nums">
                {flagged}
                {` / `}
                {mines}
                {' '}
                🚩
            </p>
        </div>
    );
}
