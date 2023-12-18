import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { useMinesweeper } from '~/utils/hooks';

export function Confetti() {
    const status = useMinesweeper((state) => state.gameStatus);
    const [displayConfetti, setDisplayConfetti] = useState(false);

    useEffect(() => {
        if (status === 'won') {
            setDisplayConfetti(true);
            const timeout = setTimeout(() => {
                setDisplayConfetti(false);
            }, 4000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [status]);

    return displayConfetti ? <ConfettiExplosion /> : null;
}
