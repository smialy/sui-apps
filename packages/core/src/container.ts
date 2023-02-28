import { Container, Provider } from "../../apps/src/types";

export class CommonContainer implements Container {
    private registry: Map<string, any> = new Map();
    constructor() {}

    public register(provider: Provider): void {
        const { name, value, factory } = provider;
        if (value) {
            this.registry.set(name, value);
        } else if(factory) {
            this.registry.set(name, factory(this.getDeps(provider)));
        }
    }

    public get<T>(name: string): T {
        if (!this.registry.has(name)) {
            throw Error(`Not found "${name}" entry `);
        }
        return this.registry.get(name) as T;
    }

    private getDeps({ name, deps }: Provider): {[others: string]: any} {
        const depsInstances: Record<string, any> = {};
        if (deps) {
            if (Array.isArray(deps)) {
                for(const key of deps) {
                    if (!this.registry.has(key)) {
                        throw Error(`Not found "${key}" dependency for "${name}" provider: `);
                    }
                    depsInstances[key] = this.registry.get(key);
                }
            } else if (typeof deps === 'object') {
                for(const [key, target] of Object.entries(deps)) {
                    if (!this.registry.has(key)) {
                        throw Error(`Not found "${key}" dependency for "${name}" provider`);
                    }
                    depsInstances[target] = this.registry.get(key) as any;
                }
            } else {
                throw Error(`Incorrect deps format for "${name}" provider`);
            }
        }
        return depsInstances;
    }
}
