// Generated at: 2023-02-28T08:42:20.096Z
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var hooks = require('preact/hooks');
var core = require('@sui-apps/core');
var router = require('@sui-apps/router');
var preact = require('@sui-apps/preact');

class Activator {
    start(ctx) {
        view();
    }
    stop(ctx) {}
}
function view() {
    const root = core.createApp('root', {
        providers: [
            {
                name: 'component',
                value: RootComponent
            },
            {
                name: 'router',
                factory: router.createRouter,
                cascade: true
            }
        ]
    });
    // setTimeout(() => {
    root.registerApp('login-app', {
        // priority: 10,
        regions: [
            'root'
        ],
        providers: [
            {
                name: 'component',
                value: LoginAppComponent
            }
        ]
    });
    // }, 10000);
    root.registerApp('info-app', {
        // priority: 20,
        regions: [
            'root'
        ],
        providers: [
            {
                name: 'component',
                value: InfoAppComponent
            }
        ]
    });
    setTimeout(()=>{
    // root.unregisterApp('info-app');
    }, 12000);
    const container = document.createElement('div');
    container.classList.add('app');
    document.body.appendChild(container);
    preact.mount(root, container);
// setTimeout(() => dispose(), 10000);
}
function LoginAppComponent() {
    console.log(`LoginAppComponent()`, preact.useApp().getName());
    return /*#__PURE__*/ jsxRuntime.jsx("div", {
        class: "app-login",
        children: "Login"
    });
}
const Test = ()=>/*#__PURE__*/ jsxRuntime.jsx("div", {
        children: "Hello From Test"
    });
function InfoAppComponent() {
    return /*#__PURE__*/ jsxRuntime.jsxs("div", {
        class: "app-info",
        children: [
            "Info",
            /*#__PURE__*/ jsxRuntime.jsx("div", {
                children: /*#__PURE__*/ jsxRuntime.jsx(preact.Link, {
                    to: "/",
                    children: "/"
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx("div", {
                children: /*#__PURE__*/ jsxRuntime.jsx(preact.Link, {
                    to: "/test",
                    children: "/test"
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx("div", {
                children: /*#__PURE__*/ jsxRuntime.jsx(preact.Link, {
                    to: "/a/b/c",
                    children: "/a/b/c"
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(preact.Route, {
                path: "/test",
                children: /*#__PURE__*/ jsxRuntime.jsx(Test, {})
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(preact.Switch, {
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(preact.Route, {
                        path: "/a/b/c",
                        children: /*#__PURE__*/ jsxRuntime.jsx("div", {
                            children: "Route: /a/b/c"
                        })
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(preact.Route, {
                        children: /*#__PURE__*/ jsxRuntime.jsx("div", {
                            children: "Default"
                        })
                    })
                ]
            })
        ]
    });
}
function RootComponent() {
    const app = preact.useApp();
    hooks.useEffect(()=>{
        const router = app.get('router');
        setTimeout(()=>{
            router.push('/test');
        }, 3000);
        setTimeout(()=>{
            router.push('/a/b/c');
        }, 6000);
    // return router.subscribe({}, match => {
    //     console.log({ match });
    // });
    }, []);
    return /*#__PURE__*/ jsxRuntime.jsx(preact.Region, {
        slot: "root"
    });
}

exports.Activator = Activator;
exports.view = view;
