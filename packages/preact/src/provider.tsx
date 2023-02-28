import { App } from '@sui-apps/core';
import { AppContext } from './hooks';

type AnyProps = Record<string, any>;

// without it react will update all DOM
const providerCache = new WeakMap();

export function provider(app: App) {
    const Component = app.get('component');
    if (!Component) {
        console.warn('Missing component');
    }
    if (app.getOption('extend')) {
        if(!providerCache.has(Component)) {
            providerCache.set(Component, (props: AnyProps) => (
                <AppContext.Provider value={app}>
                    <Component {...props } />
                </AppContext.Provider>
            ));
        }
        return providerCache.get(Component);
    }
    return Component;
}