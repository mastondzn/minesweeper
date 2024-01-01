import './index.css';

import { BrowserTracing, init as initializeSentry, Replay } from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';

initializeSentry({
    dsn: 'https://cf4f01848d43efd5adbd6658da1165f9@o4506493464805376.ingest.sentry.io/4506493754277888',
    integrations: [
        new BrowserTracing({
            tracePropagationTargets: [
                /localhost(:\d+)?/,
                /127.0.0.1(:\d+)?/,
                /minesweeper.maston.dev/,
            ],
        }),
        new Replay({
            maskAllText: false,
            blockAllMedia: false,
        }),
    ],
    tracesSampleRate: 1,
});

const root = document.querySelector('#root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>,
);
