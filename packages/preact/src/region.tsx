import { useSignal } from "@preact/signals";
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useApp } from "./hooks";
import { provider } from "./provider";

type RegionProps = {
    slot: string,
    [name: string]: any
}

type Result = {
    Component: FunctionComponent,
    key: string,
}

export function Region({ slot, ...props }: RegionProps) {
    const apps = useSignal([]);
    const app = useApp();
    useEffect(() => app.subscribe(slot, list => {
        const result = list.map(instance => {
            const Component = provider(instance);
            const name = instance.getName();
            return {
                Component,
                key: `region-${slot}-${name}`,
            } as Result;
        });
        apps.value = result;
    }), [slot]);
    return (
        <div key={`region-${slot}`} data-slot={slot} class={`region-${slot}`}>
            {(apps.value).map(({ Component, key }) => <Component key={key} {...props} />)}
        </div>
    );
}
