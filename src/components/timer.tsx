import ms from 'pretty-ms';
import { useEffect, useState } from 'react';
import { TbRefresh } from 'react-icons/tb';

import { Button } from './button';
import { store, useGame } from '~/utils/game';
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
    }, [startedAt, endedAt]);

    const styles = cn({
        'text-red-500 dark:text-red-400': gameStatus === 'lost',
        'text-green-500 dark:text-green-400': gameStatus === 'won',
    });

    return (
        <Button
            className="flex justify-between gap-2 bg-muted p-3"
            variant="secondary"
            onClick={() => store.send({ type: 'restart' })}
        >
            <TbRefresh className={cn(styles, 'size-6')} />
            <div className={cn(styles, 'text-lg tabular-nums')}>
                {ms(milliseconds, {
                    colonNotation: true,
                    keepDecimalsOnWholeSeconds: true,
                })}
            </div>
        </Button>
    );
}
