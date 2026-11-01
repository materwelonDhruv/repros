# `createServer()` keeps its file watcher open when `configureServer` or `buildStart` throws

When a plugin throws in `configureServer` or `buildStart`, `createServer()` rejects, but the file watcher it already started stays open. The caller doesn't get a server back to close, so the process never exits. A throw from `config` or `configResolved` comes before the watcher starts, and the process exits fine.

Tested on `vite@8.3.5`, Node 26, macOS.

## Repro

```sh
pnpm install
pnpm repro
```

`repro.ts` starts a child process per hook. Each one calls `createServer()` with a plugin that throws from that hook, catches the rejection, and doesn't do anything else. The parent kills any child still running after 5s. It runs once with the default watcher and once with `server.watch: null`.

**Expected:** every child exits once `createServer()` rejects.

**Actual:** with the default watcher, the `configureServer` and `buildStart` ones never exit.

```txt
default watcher
  config: exited
  configResolved: exited
  configureServer: still running after 5s
  buildStart: still running after 5s
server.watch: null
  config: exited
  configResolved: exited
  configureServer: exited
  buildStart: exited
```
