import { spawn } from 'node:child_process';
import { renameSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const ORIGIN = 'http://localhost:3456';
const OLD_DIR = 'content/blog/old-name';
const NEW_DIR = 'content/blog/new-name';

const status = async (slug: string) => (await fetch(`${ORIGIN}/blog/${slug}`)).status;

const dev = spawn('pnpm', ['exec', 'next', 'dev', '--port', '3456'], {
    stdio: 'ignore'
});

async function waitForDev() {
    for (let i = 0; i < 120; i++) {
        if ((await status('old-name').catch(() => 0)) === 200) return;
        await sleep(1000);
    }
    throw new Error('next dev never served /blog/old-name');
}

try {
    await waitForDev();
    console.log('before rename: /blog/old-name', await status('old-name'));

    renameSync(OLD_DIR, NEW_DIR);
    await sleep(3000);

    const oldStatus = await status('old-name');
    const newStatus = await status('new-name');
    console.log('after rename:  /blog/old-name', oldStatus);
    console.log('after rename:  /blog/new-name', newStatus);

    // old-name should be 404 and new-name should be 200
    process.exitCode = oldStatus === 404 && newStatus === 200 ? 0 : 1;
} finally {
    dev.kill();
    try {
        renameSync(NEW_DIR, OLD_DIR);
    } catch {
        // the rename never happened
        // you'll see that new name is also 404
    }
}
