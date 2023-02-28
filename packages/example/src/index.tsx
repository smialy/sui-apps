import { useEffect } from 'preact/hooks';
import { createApp } from '@sui-apps/core';
import { createRouter, Router } from '@sui-apps/router';
import { mount, useApp, Region, Link, Route, Switch } from '@sui-apps/preact';
export class Activator{
    start(ctx) {
        view();
    }
    stop(ctx) {
    }
}


export function view() {
    const root = createApp('root', {
        providers: [{
            name: 'component',
            value: RootComponent,
        }, {
            name: 'router',
            factory: createRouter,
            cascade: true,
        }]
    });

    // setTimeout(() => {
        root.registerApp('login-app', {
            // priority: 10,
            regions: ['root'],
            providers: [{
                name: 'component',
                value: LoginAppComponent,
            }]
        });
    // }, 10000);
    root.registerApp('info-app', {
        // priority: 20,
        regions: ['root'],
        providers: [{
            name: 'component',
            value: InfoAppComponent,
        }]
    });

    setTimeout(() => {
        // root.unregisterApp('info-app');
    }, 12000)


    const container = document.createElement('div');
    container.classList.add('app');
    document.body.appendChild(container);
    const dispose = mount(root, container);
    // setTimeout(() => dispose(), 10000);
}

function LoginAppComponent() {
    console.log(`LoginAppComponent()`, useApp().getName());
    return (
        <div class="app-login">
            Login
        </div>
    );
}

const Test = () => (
    <div>Hello From Test</div>
);


function InfoAppComponent() {
    return (
        <div class="app-info">
            Info
            <div>
                <Link to="/">/</Link>
            </div>
            <div>
                <Link to="/test">/test</Link>
            </div>
            <div>
                <Link to="/a/b/c">/a/b/c</Link>
            </div>

            <Route path="/test">
                <Test />
            </Route>

            <Switch>
                <Route path="/a/b/c">
                    <div>
                        Route: /a/b/c
                    </div>
                </Route>
                <Route>
                    <div>
                        Default
                    </div>
                </Route>
            </Switch>
        </div>
    );
}

function RootComponent() {
    const app = useApp();
    useEffect(() => {
        const router = app.get<Router>('router');
        setTimeout(() => {
            router.push('/test');
        }, 3000);
        setTimeout(() => {
            router.push('/a/b/c');
        }, 6000);
        // return router.subscribe({}, match => {
        //     console.log({ match });
        // });
    }, []);
    return (
        <Region slot="root"/>
    )
}