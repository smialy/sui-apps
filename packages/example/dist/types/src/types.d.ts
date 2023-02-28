export interface Subscriber {
    (apps: App[]): void;
}
export interface Provider {
    name: string;
    value?: any;
    factory?: (deps: any) => any;
    deps?: string[] | Record<string, string>;
    cascade?: boolean;
}
export interface App {
    getName(): string;
    get<T = any>(name: string): T;
    registerApp(name: string, options?: Partial<AppOptions>): void;
    instantiateApp(name: string, regionName?: string | null, regionKey?: string | null): App;
    unregisterApp(name: string): any;
    subscribe(regionName: string, subscriber: Subscriber): () => void;
}
export interface AppOptions {
    regions: string[];
    priority: number;
    providers: Provider[];
    parent: App | null;
}
export interface App {
    getName(): string;
    getProviders(): Provider[];
    get<T = any>(name: string): T;
    registerApp(name: string, options: Partial<AppOptions>): void;
    getParent(): App;
}
export interface Container {
    register(provider: Provider): void;
    get<T>(name: string): T;
}
