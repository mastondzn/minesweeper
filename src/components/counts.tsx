import { useGame } from '~/utils/game';
import { presets } from '~/utils/presets';

export function Count() {
    const mines = useGame((state) => presets.get(state.context.settings.preset).mines);
    const flagged = useGame((state) => {
        let flagged = 0;

        for (const { value: cell } of state.context.grid) {
            if (cell.flagged) flagged++;
        }

        return flagged;
    });

    return (
        <div className="flex flex-row items-center gap-4 rounded-md border-2 pr-1.5 pl-3">
            <p className="text-center text-lg font-semibold whitespace-nowrap tabular-nums">
                {`${flagged} / ${mines} 🚩`}
            </p>
        </div>
    );
}
