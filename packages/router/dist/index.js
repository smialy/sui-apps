// Generated at: 2023-02-28T09:59:48.560Z
'use strict';

var history = require('history');

function exec(location, options) {
    if (options.exact && location.pathname.length !== (options.path || '').length) {
        return null;
    }
    const url = splitUrl(location.pathname);
    const route = options.path ? splitUrl(options.path) : [];
    const params = {};
    const len = options.exact ? Math.max(url.length, route.length) : Math.min(url.length, route.length);
    for (let i = 0; i < len; i += 1) {
        if (route[i] !== url[i]) {
            return null;
        }
    }
    return params;
}
const splitUrl = (url) => url.replace(/^\/+|\/+$/g, '').split('/');

function createRouter(type, options) {
    return new BrowserRouter(getHistoryAdapter(type, options));
}
function getHistoryAdapter(type, options) {
    switch (type) {
        case 'memory': return history.createMemoryHistory(options);
        case 'browser': return history.createBrowserHistory(options);
        case 'hash':
        default:
            return history.createHashHistory(options);
    }
}
class BrowserRouter {
    constructor(history) {
        this.history = history;
        this.listeners = new Set();
        this.disposeListen = this.history.listen(({ action, location }) => {
            for (const { type, listener, options } of this.listeners) {
                if (type === 'match') {
                    listener(exec(location, options));
                }
                else {
                    listener(location);
                }
            }
        });
    }
    subscribeMatch(options, listener) {
        const item = {
            type: 'match',
            listener,
            options
        };
        this.listeners.add(item);
        listener(this.getMatch(this.history.location, options));
        return () => this.listeners.delete(item);
    }
    subscribeChange(listener) {
        const item = {
            type: 'change',
            listener,
        };
        this.listeners.add(item);
        listener(this.history.location);
        return () => this.listeners.delete(item);
    }
    getLocation() {
        return this.history.location;
    }
    getMatch(location, options) {
        return exec(location, options);
    }
    go(n) {
        this.history.go(n);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    push(to, state) {
        this.history.push(to, state);
    }
    replace(path, state) {
        this.history.replace(path, state);
    }
    destroy() {
        if (this.disposeListen) {
            this.disposeListen();
            this.disposeListen = null;
        }
    }
}

exports.BrowserRouter = BrowserRouter;
exports.createRouter = createRouter;
exports.getHistoryAdapter = getHistoryAdapter;
