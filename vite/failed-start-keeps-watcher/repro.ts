import { spawnSync } from 'node:child_process';

import { createServer } from 'vite';

const HOOKS = ['config', 'configResolved', 'configureServer', 'buildStart'] as const;
type Hook = (typeof HOOKS)[number];
const HANG_MS = 5000;

async function startThrowingIn(hook: Hook, watch: boolean): Promise<void> {
    try {
        await createServer({
            configFile: false,
            logLevel: 'silent',
            server: { middlewareMode: true, ws: false, ...(!watch && { watch: null }) },
            plugins: [
                {
                    name: `throws-in-${hook}`,
                    [hook]() {
                        throw new Error('missing required option `apiKey`');
                    }
                }
            ]
        });
    } catch {
        // the caller doesn't get a server to close here
    }
}

const [childHook, childWatch] = process.argv.slice(2);
if (childHook) {
    await startThrowingIn(childHook as Hook, childWatch !== 'nowatch');
} else {
    for (const watch of ['watch', 'nowatch']) {
        console.log(watch === 'watch' ? 'default watcher' : 'server.watch: null');
        for (const hook of HOOKS) {
            const run = spawnSync(process.execPath, [...process.execArgv, import.meta.filename, hook, watch], {
                timeout: HANG_MS
            });
            console.log(`  ${hook}: ${run.signal ? `still running after ${HANG_MS / 1000}s` : 'exited'}`);
        }
    }
}
