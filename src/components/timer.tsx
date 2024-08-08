import { IconRefresh } from '@tabler/icons-react';
import ms from 'pretty-ms';
import { useEffect, useState } from 'react';

import { Button } from './button';
import { store, useGame } from '~/utils/minesweeper';
import { cn } from '~/utils/tailwind';

export function Timer() {
    const [milliseconds, setMilliseconds] = useState(0);
    const gameStatus = useGame((state) => state.context.gameStatus);
    const startedAt = useGame((state) => state.context.startedAt);
    const endedAt = useGame((state) => state.context.endedAt);

    useEffect(() => {
        if (startedAt && endedAt) {
            setMilliseconds(endedAt.getTime() - startedAt.getTime());
        } else if (startedAt) {
            const interval = setInterval(
                () => setMilliseconds(Date.now() - startedAt.getTime()),
                100,
            );
            return () => clearInterval(interval);
        } else {
            setMilliseconds(0);
        }
    }, [startedAt, endedAt, gameStatus]);

    const className = cn(
        gameStatus === 'lost' && 'text-red-500 dark:text-red-400',
        gameStatus === 'won' && 'text-green-500 dark:text-green-400',
    );

    return (
        <Button
            className="flex justify-between gap-2 bg-muted p-3"
            variant="secondary"
            onClick={() => store.send({ type: 'restart' })}
        >
            <IconRefresh className={className} />
            <div className={cn(className, 'text-lg tabular-nums')}>{customMs(milliseconds)}</div>
        </Button>
    );
}

function customMs(milliseconds: number) {
    const raw = ms(milliseconds, {
        colonNotation: true,
        millisecondsDecimalDigits: 1,
        secondsDecimalDigits: 1,
    });

    return raw.includes('.') ? raw : `${raw}.0`;
}
