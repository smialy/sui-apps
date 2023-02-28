// Generated at: 2023-02-28T11:45:12.422Z
'use strict';

class CommonContainer {
    constructor() {
        this.registry = new Map();
    }
    register(provider) {
        const { name, value, factory } = provider;
        if (value) {
            this.registry.set(name, value);
        }
        else if (factory) {
            this.registry.set(name, factory(this.getDeps(provider)));
        }
    }
    get(name) {
        if (!this.registry.has(name)) {
            throw Error(`Not found "${name}" entry `);
        }
        return this.registry.get(name);
    }
    getDeps({ name, deps }) {
        const depsInstances = {};
        if (deps) {
            if (Array.isArray(deps)) {
                for (const key of deps) {
                    if (!this.registry.has(key)) {
                        throw Error(`Not found "${key}" dependency for "${name}" provider: `);
                    }
                    depsInstances[key] = this.registry.get(key);
                }
            }
            else if (typeof deps === 'object') {
                for (const [key, target] of Object.entries(deps)) {
                    if (!this.registry.has(key)) {
                        throw Error(`Not found "${key}" dependency for "${name}" provider`);
                    }
                    depsInstances[target] = this.registry.get(key);
                }
            }
            else {
                throw Error(`Incorrect deps format for "${name}" provider`);
            }
        }
        return depsInstances;
    }
}

const DEFAULT_PRIORITY = 100;
function createApp(name, options = {}) {
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
function validateAppOptions(name, options = {}) {
    if (!name) {
        throw new Error('Missing "name" in options');
    }
    const ptype = typeof options.priority;
    if (ptype !== 'undefined') {
        if (ptype !== 'number') {
            throw new Error('Incorrect type of "priority" in options');
        }
    }
    return { ...DEFAULT_OPTIONS, ...options };
}
class CommonApp {
    constructor(name, options) {
        this.name = name;
        this.options = options;
        this.register = new Map();
        this.subscribers = new Map();
        this.container = new CommonContainer();
        this.populateContainer();
    }
    getOption(name) {
        return this.options[name];
    }
    populateContainer() {
        this.container.register({
            name: 'app',
            value: this
        });
        for (const app of this.getParents().reverse()) {
            for (const provider of app.getProviders()) {
                if (provider.cascade) {
                    this.container.register({
                        name: provider.name,
                        value: app.get(provider.name),
                    });
                }
            }
        }
        for (const provider of this.options.providers) {
            this.container.register(provider);
        }
    }
    getProviders() {
        return this.options.providers.map(p => ({ ...p }));
    }
    getParent() {
        return this.options.parent || null;
    }
    getParents() {
        const parents = [];
        let parent = this;
        for (let i = 0; i < 10; i += 1) {
            parent = parent.getParent();
            if (parent) {
                parents.push(parent);
            }
            else {
                break;
            }
        }
        return parents;
    }
    getName() {
        return this.name;
    }
    get(name) {
        return this.container.get(name);
    }
    registerApp(name, partialOptions) {
        const options = validateAppOptions(name, partialOptions);
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
    unregisterApp(name) {
        if (!this.register.has(name)) {
            throw new Error(`App '${name}' has not been registered in app: ${this.name}.`);
        }
        const app = this.register.get(name);
        this.register.delete(name);
        this.notifySubscriber(app.options.regions);
    }
    subscribe(regionName, subscriber) {
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
    instantiateApp(name, regionName = null, regionKey = null) {
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
    notifySubscriber(regions) {
        for (const regionName of regions) {
            const subscribers = this.subscribers.get(regionName);
            for (const subscriber of subscribers || []) {
                subscriber(this.getRegionInstances(regionName));
            }
        }
    }
    getRegionInstances(regionName) {
        return [...this.register.values()]
            .filter(app => app.options.regions.includes(regionName))
            .sort((a, b) => a.options.priority - b.options.priority)
            .map(app => this.instantiateApp(app.name, regionName));
    }
    // private getAppInstance(name: string, regionName: string, regionKey: string = null) {
    //     const key = this.getAppInstanceKey(regionName, regionKey);
    //     return this.register.get(name).instances.get(key);
    // }
    getAppInstanceKey(regionName, regionKey) {
        if (this.options.multi || !regionName && !regionKey) {
            return 'default';
        }
        if (regionName && regionKey) {
            return `${regionName}_${regionKey}`;
        }
        return regionName;
    }
}

exports.createApp = createApp;
