import { Update, To, Location } from 'history';

export type HistoryType = 'browser' | 'hash' | 'memory';

export interface Listener {
    (update: Update): void;
}

export interface MatchOptions {
    path: string,
    exact: boolean,
}

export type Match = Record<string, string>;

export interface MatchListener {
    (match: Match): void;
}

export interface ChangeListener {
    (location: Location): void;
}


export interface Router {
    getLocation(): Location;
    getMatch(location: Location, options: MatchOptions): Match | null;
    go(n: number): void;
    back(): void;
    forward(): void;
    push(to: To, state?: any): void;
    replace(path: string, state?: any): void;
    subscribeMatch(options: MatchOptions, listener: MatchListener): () => void;
    subscribeChange(listener: ChangeListener): () => void;

    destroy(): void;
}