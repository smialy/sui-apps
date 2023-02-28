import { History, createBrowserHistory, createHashHistory, createMemoryHistory, Update, To, Location, Action, Listener } from 'history';
import { ChangeListener, HistoryType, Match, MatchListener, MatchOptions, Router } from './types';
import { exec } from './utils';

export function createRouter(type: HistoryType, options?: any) {
    return new BrowserRouter(getHistoryAdapter(type, options));
}

export function getHistoryAdapter(type: HistoryType, options?: any): History {
    switch(type) {
        case 'memory': return createMemoryHistory(options);
        case 'browser': return createBrowserHistory(options);
        case 'hash':
        default:
            return createHashHistory(options);
    }
}

interface ListenerSet {
    type: 'change' | 'match',
    options?: MatchOptions,
    listener: MatchListener | ChangeListener,
}


export class BrowserRouter implements Router {
    private listeners: Set<ListenerSet> = new Set();
    private disposeListen;
    constructor(private history: History) {
        this.disposeListen = this.history.listen(({ action, location }: Update) => {
            for(const { type, listener, options } of this.listeners) {
                if (type === 'match') {
                    (listener as MatchListener)(exec(location, options))
                } else {
                    (listener as ChangeListener)(location);
                }
            }
        });
    }
    subscribeMatch(options: MatchOptions, listener: MatchListener): () => void {
        const item = {
            type: 'match',
            listener,
            options
        } as ListenerSet;
        this.listeners.add(item);
        listener(this.getMatch(this.history.location, options));
        return () => this.listeners.delete(item);
    }
    subscribeChange(listener: ChangeListener): () => void {
        const item = {
            type: 'change',
            listener,
        } as ListenerSet;
        this.listeners.add(item);
        listener(this.history.location);
        return () => this.listeners.delete(item);

    }
    getLocation(): Location {
        return this.history.location;
    }
    getMatch(location: Location, options: MatchOptions): Match | null {
        return exec(location, options);
    }
    go(n: number): void {
        this.history.go(n)
    }
    back(): void {
        this.history.back();
    }
    forward(): void {
        this.history.forward();
    }
    push(to: To, state?: any): void {
        this.history.push(to, state)
    }
    replace(path: string, state?: any): void {
        this.history.replace(path, state);
    }
    destroy() {
        if (this.disposeListen) {
            this.disposeListen();
            this.disposeListen = null;
        }
    }
}