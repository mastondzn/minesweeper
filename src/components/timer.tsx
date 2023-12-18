import { IconRefresh } from '@tabler/icons-react';
import ms from 'pretty-ms';

import { Button } from './button';
import { cn } from '~/utils/classnames';
import { useTimer } from '~/utils/hooks';

export function Timer({ onClick }: { onClick: () => void }) {
    const { milliseconds, gameStatus } = useTimer();

    return (
        <Button className="flex justify-between gap-1" variant="secondary" onClick={onClick}>
            <IconRefresh
                className={cn(
                    gameStatus === 'lost' && 'text-red-400',
                    gameStatus === 'won' && 'text-green-700',
                )}
            />
            <div
                className={cn(
                    'text-lg tabular-nums',
                    gameStatus === 'lost' && 'text-red-400',
                    gameStatus === 'won' && 'text-green-700',
                )}
            >
                {customMs(milliseconds)}
            </div>
        </Button>
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
