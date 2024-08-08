import { IconRefresh } from '@tabler/icons-react';
import ms from 'pretty-ms';
import { useEffect, useState } from 'react';

import { Button } from './button';
import { cn } from '~/utils/tailwind';
import type { GameStatus } from '~/utils/types';

export function Timer({
    onClick,
    startedAt,
    endedAt,
    gameStatus,
}: {
    onClick: () => void;
    startedAt: Date | null;
    endedAt: Date | null;
    gameStatus: GameStatus;
}) {
    const [milliseconds, setMilliseconds] = useState(0);

    useEffect(() => {
        if (startedAt && endedAt) {
            setMilliseconds(endedAt.getTime() - startedAt.getTime());
        } else if (startedAt) {
            const interval = setInterval(() => {
                setMilliseconds(Date.now() - startedAt.getTime());
            }, 100);
            return () => {
                clearInterval(interval);
            };
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
            onClick={onClick}
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
