import { useEffect } from 'react';

export const useKeyPress = (
    targetKey: string,
    {
        onDown,
        onUp,
    }: {
        onDown?: () => void;
        onUp?: () => void;
    },
) => {
    const downHandler = ({ key }: { key: string }) => {
        if (key === targetKey) onDown?.();
    };

    const upHandler = ({ key }: { key: string }) => {
        if (key === targetKey) onUp?.();
    };

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);
};
