import type { Config } from 'prettier';

const config: Config = {
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 120,
    proseWrap: 'never',
    overrides: [{ files: '*.{yml,yaml}', options: { tabWidth: 2 } }]
};

export default config;
