// Generated at: 2023-02-28T11:43:02.138Z
'use strict';

var preact = require('preact');
var hooks = require('preact/hooks');
var jsxRuntime = require('preact/jsx-runtime');
var signals = require('@preact/signals');

const AppContext = preact.createContext(null);
function useApp() {
    const app = hooks.useContext(AppContext);
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
            providerCache.set(Component, (props) => (jsxRuntime.jsx(AppContext.Provider, { value: app, children: jsxRuntime.jsx(Component, { ...props }) })));
        }
        return providerCache.get(Component);
    }
    return Component;
}

function mount(app, container) {
    const Component = provider(app);
    preact.render(jsxRuntime.jsx(Component, {}), container);
    return () => preact.render('', container);
}

function Region({ slot, ...props }) {
    const apps = signals.useSignal([]);
    const app = useApp();
    hooks.useEffect(() => app.subscribe(slot, list => {
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
    return (jsxRuntime.jsx("div", { "data-slot": slot, class: `region-${slot}`, children: (apps.value).map(({ Component, key }) => jsxRuntime.jsx(Component, { ...props }, key)) }, `region-${slot}`));
}

function Route({ path, exact = false, component, children }) {
    const match = signals.useSignal(null);
    const app = useApp();
    hooks.useEffect(() => app.get('router').subscribeMatch({ path, exact }, m => {
        match.value = m;
    }), [path, exact]);
    if (!match.value) {
        return null;
    }
    if (component) {
        const Component = component;
        return jsxRuntime.jsx(Component, { match: match });
    }
    if (children) {
        return children;
    }
    return null;
}
function Link({ to, children }) {
    const active = signals.useSignal('inactive');
    const router = useApp().get('router');
    hooks.useEffect(() => router.subscribeMatch({ path: to, exact: true }, m => {
        active.value = m ? 'active' : 'inactive';
    }), [to]);
    const handleClick = e => {
        e.preventDefault();
        if (router.getMatch(router.getLocation(), { exact: true, path: to }) === null) {
            router.push(to);
        }
    };
    return (jsxRuntime.jsx("a", { href: to, "data-state": active, onClick: handleClick, children: children }));
}
function Switch({ children }) {
    const [_, setLocation] = hooks.useState(null);
    const router = useApp().get('router');
    hooks.useEffect(() => router.subscribeChange((location) => setLocation(location)), []);
    return preact.toChildArray(children).find(child => {
        if (preact.isValidElement(child)) {
            const { path, exact } = child.props;
            const m = router.getMatch(router.getLocation(), { exact, path });
            return m !== null;
        }
    });
}

exports.AppContext = AppContext;
exports.Link = Link;
exports.Region = Region;
exports.Route = Route;
exports.Switch = Switch;
exports.mount = mount;
exports.useApp = useApp;
