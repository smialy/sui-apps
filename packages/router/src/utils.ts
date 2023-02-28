import { Location } from "history";
import { Match, MatchOptions } from "./types";

export function exec(location: Location, options: MatchOptions): Match | null {
    if (options.exact && location.pathname.length !== (options.path ||'').length) {
        return null;
    }
    const url = splitUrl(location.pathname);
    const route = options.path ? splitUrl(options.path) : [];
    const params = {}
    const len = options.exact ? Math.max(url.length, route.length) : Math.min(url.length, route.length);
    for(let i = 0;i < len;i+=1) {
        if (route[i] !== url[i]) {
            return null;
        }
    }
    return params;
}

const splitUrl = (url: string) => url.replace(/^\/+|\/+$/g, '').split('/');