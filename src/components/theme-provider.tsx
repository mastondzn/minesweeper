import { createContext, useContext, useEffect, useState } from 'react';

import { type Theme, storage } from '~/utils/storage';

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
    theme: storage.get('theme'),
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => storage.get('theme'));

    useEffect(() => {
        const root = globalThis.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            storage.set('theme', theme);
            setTheme(theme);
        },
    };

    return <ThemeProviderContext value={value}>{children}</ThemeProviderContext>;
}

export function useTheme() {
    const context = useContext(ThemeProviderContext);
    return context;
}
