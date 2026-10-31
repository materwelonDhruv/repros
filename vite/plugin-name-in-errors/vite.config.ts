import { defineConfig } from 'vite';

import { type Hook, pluginsThrowingIn } from './plugins.ts';

export default defineConfig({
    plugins: pluginsThrowingIn((process.env.THROW_IN ?? 'config') as Hook)
});
