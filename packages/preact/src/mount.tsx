import { App } from '@sui-apps/core';
import { render } from 'preact';
import { provider } from './provider';

export function mount(app: App, container: HTMLElement) {
    const Component = provider(app);
    render(<Component />, container);
    return () => render('', container);
}
