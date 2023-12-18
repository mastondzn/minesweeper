import '@fontsource/inter';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>,
);
