# `fumadocs-mdx/macro` keeps a renamed or deleted file in `next dev`

If you rename or delete a content folder while `next dev` runs, a collection from `defineDocs` in `fumadocs-mdx/macro` doesn't update. The old URL and the new one both 404 until something else re-runs the macro, like adding a new folder.

Tested on `fumadocs-mdx@15.4.6`, `fumadocs-core@16.15.18`, `next@16.3.8` (Turbopack), macOS.

## Repro

```sh
pnpm install
pnpm repro
```

`repro.ts` starts `next dev` and loads `/blog/old-name`. Then it renames `content/blog/old-name` to `new-name` and loads both URLs again. It renames the folder back when it's done.

**Expected:** `old-name` is a 404 and `new-name` is a 200.

**Actual:** both are a 404.

```txt
before rename: /blog/old-name 200
after rename:  /blog/old-name 404
after rename:  /blog/new-name 404
```

The page sets `dynamicParams = false` and has a `generateStaticParams`. Without those, `new-name` loads fine. Reading the folder with `readdirSync` in `generateStaticParams` instead of the macro also renames fine, so it isn't `generateStaticParams` on its own.
