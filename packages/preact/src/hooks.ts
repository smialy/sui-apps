import { App } from '@sui-apps/core';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const AppContext = createContext(null);

export function useApp(): App {
    const app = useContext(AppContext);
    if (!app) {
        throw new Error('useAppContext must be used within a AppContext.Provider');
    }
    return app;
}