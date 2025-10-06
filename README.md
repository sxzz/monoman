# monoman

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Unit Test][unit-test-src]][unit-test-href]

Manage monorepo common files.

## Install

```bash
npm i monoman
```

## Usage

```
pnpm monoman [-c | --check | -w | --write]
```

```ts
// monoman.config.[ts,js]
import { defineConfig } from 'monoman'

export default defineConfig([
  {
    // Globs to match files
    include: ['**/package.json'],
    exclude: ['exclude/package.json'],
    type: 'json',
    contents(data: Record<string, string>) {
      data.name = 'monoman'
      return data
    },
  },
  {
    include: ['**/package.json'],
    exclude: ['exclude/package.json'],
    type: 'text',
    contents(text) {
      return `${text} hello monoman!`
    },
  },
  {
    include = 'pnpm-lock.yaml',
    exclude: ['exclude/pnpm-lock.yaml'],
    type: 'yaml',
    contents(data: Record<string, string>) {
      data.lockfileVersion = '9.0'
      return data
    },
  },
])
```

See an [example](https://github.com/vue-macros/vue-macros/blob/main/monoman.config.ts) for more details.

## Presets

### `noDuplicatedDeps`

Make all dependencies in all `package.json` unique.

```ts
function noDuplicatedDeps({
  include = 'packages/*/package.json',
  exclude,
  distinguishType = false,
  types = ['dependencies', 'devDependencies'],
  ignoreProtocols = ['file', 'link', 'workspace'],
}: {
  include?: Arrayable<string>
  exclude?: Arrayable<string>
  distinguishType?: boolean
  types?: string[]
  ignoreProtocols?: string[]
} = {})
```

### `noDuplicatedPnpmLockfile`

```ts
function noDuplicatedPnpmLockfile({
  include = 'pnpm-lock.yaml',
  exclude,
  deps = [],
}: {
  /** Include files */
  include?: Arrayable<string>
  /** Exclude files */
  exclude?: Arrayable<string>
  /** Deps to check */
  deps?: Arrayable<string>
} = {})
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023-PRESENT [Kevin Deng](https://github.com/sxzz)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/monoman.svg
[npm-version-href]: https://npmjs.com/package/monoman
[npm-downloads-src]: https://img.shields.io/npm/dm/monoman
[npm-downloads-href]: https://www.npmcharts.com/compare/monoman?interval=30
[unit-test-src]: https://github.com/sxzz/monoman/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/sxzz/monoman/actions/workflows/unit-test.yml
