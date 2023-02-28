import { FunctionComponent, ComponentChildren } from "preact";
type RouteProps = {
    path: string;
    exact: boolean;
    component: FunctionComponent<{
        match: any;
    }>;
    render: ({ match }: {
        match: any;
    }) => FunctionComponent;
    children: ComponentChildren;
};
export declare function Route({ path, exact, component, children }: RouteProps): string | number | bigint | true | object;
type LinkProps = {
    to: string;
    children: ComponentChildren;
};
export declare function Link({ to, children }: LinkProps): import("preact").JSX.Element;
type SwitchProps = {
    children: ComponentChildren;
};
export declare function Switch({ children }: SwitchProps): string | number | import("preact").VNode<{}>;
export {};
