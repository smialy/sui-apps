import { CommonContainer } from "./container";
import { AppOptions, Container, App, Subscriber, Provider } from "./types";

const DEFAULT_PRIORITY = 100;

interface AppRegistration {
    name: string,
    options: AppOptions,
    instances: Map<string, App>,
}

export function createApp(name: string, options: Partial<AppOptions> = {}): App {
    return new CommonApp(name, validateAppOptions(name, options));
}
const DEFAULT_OPTIONS = {
    priority: DEFAULT_PRIORITY,
    parent: null,
    regions: [],
    providers: [],
    cascade: false,
    extend: true,
    multi: false,
};

function validateAppOptions(name: string, options: Partial<AppOptions> = {}): AppOptions {
    if (!name) {
        throw new Error('Missing "name" in options');
    }
    const ptype = typeof options.priority;
    if (ptype !== 'undefined'){
        if(ptype !== 'number') {
            throw new Error('Incorrect type of "priority" in options');
        }
    }

    return { ...DEFAULT_OPTIONS, ...options };
}

class CommonApp implements App {
    private register: Map<string, AppRegistration> = new Map();
    private subscribers: Map<string, Set<Subscriber>> = new Map();
    private container: Container = new CommonContainer();

    constructor(private name: string, private options: AppOptions) {
        this.populateContainer();
    }
    public getOption<T>(name: string): T {
        return this.options[name] as T;
    }
    private populateContainer() {
        this.container.register({
            name: 'app',
            value: this
        });

        for(const app of this.getParents().reverse()) {
            for (const provider of app.getProviders()) {
                if (provider.cascade) {
                    this.container.register({
                        name: provider.name,
                        value: app.get(provider.name),
                    });
                }
            }
        }

        for(const provider of this.options.providers) {
            this.container.register(provider);
        }
    }

    getProviders(): Provider[] {
        return this.options.providers.map(p => ({ ...p}));
    }

    getParent(): App {
        return this.options.parent || null;
    }

    private getParents(): App[] {
        const parents = [];
        let parent: App = this;
        for(let i = 0;i< 10;i+=1) {
            parent = parent.getParent();
            if (parent) {
                parents.push(parent);
            } else {
                break;
            }
        }
        return parents;
    }

    public getName(): string {
        return this.name;
    }

    public get<T = any>(name: string): T {
        return this.container.get<T>(name);
    }

    public registerApp(name: string, partialOptions?: Partial<AppOptions>): void {
        const options = validateAppOptions(name, partialOptions) as AppOptions;
        this.register.set(name, {
            name,
            options,
            instances: new Map(),
        });
        if (!options.multi) {
            this.instantiateApp(name);
        }
        this.notifySubscriber(options.regions);
    }

    public unregisterApp(name: string) {
        if (!this.register.has(name)) {
            throw new Error(`App '${name}' has not been registered in app: ${this.name}.`);
        }
        const app = this.register.get(name);
        this.register.delete(name);
        this.notifySubscriber(app.options.regions);
    }

    public subscribe(regionName: string, subscriber: Subscriber): () => void {
        if (!this.subscribers.has(regionName)) {
            this.subscribers.set(regionName, new Set());
        }
        this.subscribers.get(regionName).add(subscriber);
        subscriber(this.getRegionInstances(regionName));
        return () => {
            this.subscribers.get(regionName).delete(subscriber);
            if (this.subscribers.get(regionName).size === 0) {
                this.subscribers.delete(regionName);
            }
        };
    }
    public instantiateApp(name: string, regionName: string = null, regionKey: string = null) {
        if (!this.register.has(name)) {
            throw new Error(`No found app: "${name}".`);
        }
        const key = this.getAppInstanceKey(regionName, regionKey);
        const reg = this.register.get(name);
        if (!reg.instances.has(key)) {
            reg.instances.set(key, createApp(reg.name, { ...reg.options, parent: this }));
        }
        return reg.instances.get(key);
    }

    private notifySubscriber(regions: string[]) {
        for(const regionName of regions) {
            const subscribers = this.subscribers.get(regionName);
            for(const subscriber of subscribers || []) {
                subscriber(this.getRegionInstances(regionName));
            }
        }
    }
    private getRegionInstances(regionName: string): App[] {
        return [...this.register.values()]
            .filter(app => app.options.regions.includes(regionName))
            .sort((a,b) => a.options.priority - b.options.priority)
            .map(app => this.instantiateApp(app.name, regionName));
    }

    // private getAppInstance(name: string, regionName: string, regionKey: string = null) {
    //     const key = this.getAppInstanceKey(regionName, regionKey);
    //     return this.register.get(name).instances.get(key);
    // }

    private getAppInstanceKey(regionName: string, regionKey: string) {
        if (this.options.multi || !regionName && !regionKey) {
            return 'default';
        }
        if (regionName && regionKey) {
            return `${regionName}_${regionKey}`;
        }
        return regionName;
    }
}
