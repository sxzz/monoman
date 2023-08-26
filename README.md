# monoman [![npm](https://img.shields.io/npm/v/monoman.svg)](https://npmjs.com/package/monoman)

[![Unit Test](https://github.com/sxzz/monoman/actions/workflows/unit-test.yml/badge.svg)](https://github.com/sxzz/monoman/actions/workflows/unit-test.yml)

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
])
```

See an [example](https://github.com/vue-macros/vue-macros/blob/main/monoman.config.ts) for more details.

## Presets

### `dedupeDeps`

Make all dependencies in all `package.json` unique.

```ts
function dedupeDeps({
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

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023 [三咲智子](https://github.com/sxzz)
