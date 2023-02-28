// Generated at: 2023-02-28T11:43:02.099Z
import { createContext, render, toChildArray, isValidElement } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { jsx } from 'preact/jsx-runtime';
import { useSignal } from '@preact/signals';

const AppContext = createContext(null);
function useApp() {
    const app = useContext(AppContext);
    if (!app) {
        throw new Error('useAppContext must be used within a AppContext.Provider');
    }
    return app;
}

// without it react will update all DOM
const providerCache = new WeakMap();
function provider(app) {
    const Component = app.get('component');
    if (!Component) {
        console.warn('Missing component');
    }
    if (app.getOption('extend')) {
        if (!providerCache.has(Component)) {
            providerCache.set(Component, (props) => (jsx(AppContext.Provider, { value: app, children: jsx(Component, { ...props }) })));
        }
        return providerCache.get(Component);
    }
    return Component;
}

function mount(app, container) {
    const Component = provider(app);
    render(jsx(Component, {}), container);
    return () => render('', container);
}

function Region({ slot, ...props }) {
    const apps = useSignal([]);
    const app = useApp();
    useEffect(() => app.subscribe(slot, list => {
        const result = list.map(instance => {
            const Component = provider(instance);
            const name = instance.getName();
            return {
                Component,
                key: `region-${slot}-${name}`,
            };
        });
        apps.value = result;
    }), [slot]);
    return (jsx("div", { "data-slot": slot, class: `region-${slot}`, children: (apps.value).map(({ Component, key }) => jsx(Component, { ...props }, key)) }, `region-${slot}`));
}

function Route({ path, exact = false, component, children }) {
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
        return jsx(Component, { match: match });
    }
    if (children) {
        return children;
    }
    return null;
}
function Link({ to, children }) {
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
    return (jsx("a", { href: to, "data-state": active, onClick: handleClick, children: children }));
}
function Switch({ children }) {
    const [_, setLocation] = useState(null);
    const router = useApp().get('router');
    useEffect(() => router.subscribeChange((location) => setLocation(location)), []);
    return toChildArray(children).find(child => {
        if (isValidElement(child)) {
            const { path, exact } = child.props;
            const m = router.getMatch(router.getLocation(), { exact, path });
            return m !== null;
        }
    });
}

export { AppContext, Link, Region, Route, Switch, mount, useApp };
