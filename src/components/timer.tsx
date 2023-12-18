import ms from 'pretty-ms';

import { cn } from '~/utils/classnames';
import { useTimer } from '~/utils/hooks';

export function Timer() {
    const { milliseconds, gameStatus } = useTimer();

    return (
        <div
            className={cn(
                'text-lg tabular-nums',
                gameStatus === 'lost' && 'text-red-400',
                gameStatus === 'won' && 'text-green-700',
            )}
        >
            {customMs(milliseconds)}
        </div>
    );
}

const customMs = (milliseconds: number) => {
    const raw = ms(milliseconds, {
        colonNotation: true,
        millisecondsDecimalDigits: 1,
        secondsDecimalDigits: 1,
    });

    return raw.includes('.') ? raw : `${raw}.0`;
};
