# repros

## vite

- [`vite/plugin-name-in-errors/`](./vite/plugin-name-in-errors), errors from `config`, `configResolved`, `configureServer` and a dev server's `buildStart` don't say which plugin threw
- [`vite/failed-start-keeps-watcher/`](./vite/failed-start-keeps-watcher), `createServer()` keeps its file watcher open when `configureServer` or `buildStart` throws
