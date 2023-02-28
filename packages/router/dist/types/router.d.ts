import { History, To, Location } from 'history';
import { ChangeListener, HistoryType, Match, MatchListener, MatchOptions, Router } from './types';
export declare function createRouter(type: HistoryType, options?: any): BrowserRouter;
export declare function getHistoryAdapter(type: HistoryType, options?: any): History;
export declare class BrowserRouter implements Router {
    private history;
    private listeners;
    private disposeListen;
    constructor(history: History);
    subscribeMatch(options: MatchOptions, listener: MatchListener): () => void;
    subscribeChange(listener: ChangeListener): () => void;
    getLocation(): Location;
    getMatch(location: Location, options: MatchOptions): Match | null;
    go(n: number): void;
    back(): void;
    forward(): void;
    push(to: To, state?: any): void;
    replace(path: string, state?: any): void;
    destroy(): void;
}
