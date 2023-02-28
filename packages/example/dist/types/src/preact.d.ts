import { App } from './types';
export declare function useApp(): App;
export declare function mount(app: App, container: HTMLElement): () => void;
type RegionProps = {
    slot: string;
    [name: string]: any;
};
export declare function Region({ slot, ...props }: RegionProps): import("preact").JSX.Element;
export {};
