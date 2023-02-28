// Generated at: 2023-02-28T08:42:20.083Z
import { jsx, jsxs } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { createApp } from '@sui-apps/core';
import { createRouter } from '@sui-apps/router';
import { mount, useApp, Link, Route, Switch, Region } from '@sui-apps/preact';

class Activator {
    start(ctx) {
        view();
    }
    stop(ctx) {}
}
function view() {
    const root = createApp('root', {
        providers: [
            {
                name: 'component',
                value: RootComponent
            },
            {
                name: 'router',
                factory: createRouter,
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
    mount(root, container);
// setTimeout(() => dispose(), 10000);
}
function LoginAppComponent() {
    console.log(`LoginAppComponent()`, useApp().getName());
    return /*#__PURE__*/ jsx("div", {
        class: "app-login",
        children: "Login"
    });
}
const Test = ()=>/*#__PURE__*/ jsx("div", {
        children: "Hello From Test"
    });
function InfoAppComponent() {
    return /*#__PURE__*/ jsxs("div", {
        class: "app-info",
        children: [
            "Info",
            /*#__PURE__*/ jsx("div", {
                children: /*#__PURE__*/ jsx(Link, {
                    to: "/",
                    children: "/"
                })
            }),
            /*#__PURE__*/ jsx("div", {
                children: /*#__PURE__*/ jsx(Link, {
                    to: "/test",
                    children: "/test"
                })
            }),
            /*#__PURE__*/ jsx("div", {
                children: /*#__PURE__*/ jsx(Link, {
                    to: "/a/b/c",
                    children: "/a/b/c"
                })
            }),
            /*#__PURE__*/ jsx(Route, {
                path: "/test",
                children: /*#__PURE__*/ jsx(Test, {})
            }),
            /*#__PURE__*/ jsxs(Switch, {
                children: [
                    /*#__PURE__*/ jsx(Route, {
                        path: "/a/b/c",
                        children: /*#__PURE__*/ jsx("div", {
                            children: "Route: /a/b/c"
                        })
                    }),
                    /*#__PURE__*/ jsx(Route, {
                        children: /*#__PURE__*/ jsx("div", {
                            children: "Default"
                        })
                    })
                ]
            })
        ]
    });
}
function RootComponent() {
    const app = useApp();
    useEffect(()=>{
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
    return /*#__PURE__*/ jsx(Region, {
        slot: "root"
    });
}

export { Activator, view };
