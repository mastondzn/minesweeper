import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { useMinesweeper } from '~/utils/hooks';

export function Confetti() {
    const status = useMinesweeper((state) => state.gameStatus);
    const [shouldConfetti, setShouldConfetti] = useState(false);

    useEffect(() => {
        if (status === 'won') {
            setShouldConfetti(true);
            const timeout = setTimeout(() => {
                setShouldConfetti(false);
            }, 4000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [status, setShouldConfetti]);

    return shouldConfetti ? <ConfettiExplosion /> : null;
}
