import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeProviderProperties {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const initialState: ThemeProviderState = {
    theme: 'dark',
    setTheme: () => null,
    toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    storageKey = 'vite-ui-theme',
    ...properties
}: ThemeProviderProperties) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme | null) ?? initialState.theme,
    );

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
        toggleTheme: () => {
            localStorage.setItem(storageKey, theme === 'dark' ? 'light' : 'dark');
            setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'));
        },
    };

    return (
        <ThemeProviderContext.Provider {...properties} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeProviderContext);
}
