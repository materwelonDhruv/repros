# Errors from `config`, `configResolved`, `configureServer` and a dev server's `buildStart` don't say which plugin threw

When a plugin throws in one of these hooks, the error has only the plugin's own message. It doesn't have a `plugin` or `hook` field or a `[plugin name]` line. The same throw from `buildStart` during `build()` comes out of Rolldown as `[plugin throws-in-buildStart]`.

Tested on `vite@8.3.5`, Node 26, macOS.

## Repro

```sh
pnpm install
pnpm repro
```

`repro.ts` calls `build()` and `createServer()` with three plugins, and the middle one throws ``missing required option `apiKey` `` from one hook at a time. It prints `message`, `plugin` and `hook` from each error, with the stack cut off the message.

**Expected:** every error says which plugin threw, as `[plugin throws-in-<hook>]` in the message or as `plugin` and `hook` on the error.

**Actual:** only `buildStart` during `build()` does.

```txt
build()
  config: {"message":"missing required option `apiKey`"}
  configResolved: {"message":"missing required option `apiKey`"}
  buildStart: {"message":"Build failed with 1 error:\n\n[plugin throws-in-buildStart]\nError: missing required option `apiKey`"}
createServer()
  config: {"message":"missing required option `apiKey`"}
  configResolved: {"message":"missing required option `apiKey`"}
  configureServer: {"message":"missing required option `apiKey`"}
  buildStart: {"message":"missing required option `apiKey`"}
```

The CLI shows the same thing. `pnpm build:config` throws from `config` and prints no plugin name. `pnpm build:buildstart` throws from `buildStart` and prints `[plugin throws-in-buildStart]`.
