import { Container, Provider } from "../../apps/src/types";
export declare class CommonContainer implements Container {
    private registry;
    constructor();
    register(provider: Provider): void;
    get<T>(name: string): T;
    private getDeps;
}
