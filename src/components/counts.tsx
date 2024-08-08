import { useGame } from '~/utils/minesweeper';
import { presets } from '~/utils/presets';

export function Count() {
    const preset = useGame((state) => state.context.settings.preset);
    const flagged = useGame((state) => {
        let flagged = 0;

        for (const { value: cell } of state.context.grid) {
            if (cell.flagged) flagged++;
        }

        return flagged;
    });

    const { mines } = presets.get(preset);

    return (
        <div className="flex flex-row items-center gap-4 rounded-md border-2 pl-3 pr-1.5">
            <p className="whitespace-nowrap text-center text-lg font-semibold tabular-nums">
                {`${flagged} / ${mines} 🚩`}
            </p>
        </div>
    );
}
