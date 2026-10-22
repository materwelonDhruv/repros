# fumadocs repros

- [`filter-element/`](./filter-element), the option is overwritten before the stringifier reads it
- [`include-mdast/`](./include-mdast), `removePosition: true` exports `_mdast` with no value
- [`inline-code-highlight/`](./inline-code-highlight), search highlighting skips a match inside backticks
- [`macro-rename/`](./macro-rename), `fumadocs-mdx/macro` keeps a renamed or deleted file in `next dev`
