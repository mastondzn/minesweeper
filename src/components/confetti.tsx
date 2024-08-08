import ConfettiExplosion from 'react-confetti-explosion';

import { useGame } from '~/utils/minesweeper';

export function Confetti() {
    const gameStatus = useGame((state) => state.context.gameStatus);

    if (gameStatus !== 'won') return null;

    return <ConfettiExplosion />;
}
