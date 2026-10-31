import type { Plugin } from 'vite';

export type Hook = 'config' | 'configResolved' | 'configureServer' | 'buildStart';

// sample plugin installed from wherever
function throwsIn(hook: Hook): Plugin {
    return {
        name: `throws-in-${hook}`,
        [hook]() {
            throw new Error('missing required option `apiKey`');
        }
    };
}

function harmless(name: string): Plugin {
    return { name, config() {} };
}

export function pluginsThrowingIn(hook: Hook): Plugin[] {
    return [harmless('plugin-a'), throwsIn(hook), harmless('plugin-b')];
}
