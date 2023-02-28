import { useSignal } from "@preact/signals";
import { Router } from "@sui-apps/router";

import { FunctionComponent, toChildArray, isValidElement, ComponentChildren } from "preact";
import { useEffect, useState } from 'preact/hooks';
import { useApp } from "./hooks";

type RouteProps = {
    path: string,
    exact: boolean,
    component: FunctionComponent<{match: any}>,
    render: ({ match }) => FunctionComponent,
    children: ComponentChildren,
};

export function Route({ path, exact = false, component, children }: RouteProps) {
    const match = useSignal(null);
    const app = useApp();
    useEffect(() => app.get('router').subscribeMatch({ path, exact }, m => {
        match.value = m;
    }), [path, exact]);

    if (!match.value) {
        return null;
    }

    if (component) {
        const Component = component;
        return <Component match={match} />
    }
    if (children) {
        return children;
    }
    return null;
}
type LinkProps = {
    to: string,
    children: ComponentChildren,
};

export function Link({ to, children }: LinkProps) {
    const active = useSignal('inactive');
    const router = useApp().get('router');
    useEffect(() => router.subscribeMatch({ path: to, exact: true }, m => {
        active.value = m ? 'active' : 'inactive';
    }), [to]);
    const handleClick = e => {
        e.preventDefault();
        if (router.getMatch(router.getLocation(), { exact: true, path: to }) === null) {
          router.push(to);
        }
    };
    return (
        <a href={to} data-state={active} onClick={handleClick}>
            {children}
        </a>
    );
}

type SwitchProps = {
    children: ComponentChildren,
};

export function Switch({ children }: SwitchProps) {
    const [_, setLocation] = useState(null);
    const router = useApp().get<Router>('router');
    useEffect(() =>
        router.subscribeChange(
                (location) => setLocation(location)),
    []);
    return toChildArray(children).find(child => {
        if (isValidElement(child)) {
            const { path, exact } = child.props as any;
            const m = router.getMatch(router.getLocation(), { exact, path });
            return m !== null
        }
    });
}