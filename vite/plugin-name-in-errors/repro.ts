import { build, createServer } from 'vite';

import { type Hook, pluginsThrowingIn } from './plugins.ts';

const quiet = { configFile: false, logLevel: 'silent' } as const;

async function errorFrom(run: () => Promise<unknown>): Promise<string> {
    try {
        await run();
        return 'no error';
    } catch (error) {
        const { message, plugin, hook } = error as Error & { plugin?: string; hook?: string };
        return JSON.stringify({ message: message.replace(/\n\s+at [\s\S]*/, ''), plugin, hook });
    }
}

console.log('build()');
for (const hook of ['config', 'configResolved', 'buildStart'] satisfies Hook[]) {
    console.log(`  ${hook}:`, await errorFrom(() => build({ ...quiet, plugins: pluginsThrowingIn(hook) })));
}

console.log('createServer()');
for (const hook of ['config', 'configResolved', 'configureServer', 'buildStart'] satisfies Hook[]) {
    const error = await errorFrom(async () => {
        const server = await createServer({
            ...quiet,
            plugins: pluginsThrowingIn(hook),
            server: { middlewareMode: true, ws: false, watch: null }
        });
        await server.close();
    });
    console.log(`  ${hook}:`, error);
}
