import { type Arrayable, toArray } from '@antfu/utils'
import { defineConfig } from '.'

export function dedupeDeps({
  include = 'packages/*/package.json',
  exclude,
  ignores,
  types = ['dependencies', 'devDependencies'],
  distinguishType = false,
  ignoreProtocols = ['file', 'link', 'workspace'],
}: {
  /** Include files */
  include?: Arrayable<string>
  /** Exclude files */
  exclude?: Arrayable<string>
  /** Ignore deps */
  ignores?: Arrayable<string>
  types?: string[]
  distinguishType?: boolean
  ignoreProtocols?: string[]
} = {}) {
  const globalDeps: Record<string, string> = Object.create(null)
  const ignoresDeps = toArray(ignores)
  return defineConfig([
    {
      include,
      exclude,
      type: 'json',
      contents(data: Record<string, any> | null) {
        if (!data) return

        for (const type of types) {
          const deps: Record<string, string> = data[type] || {}
          Object.entries(deps).forEach(([name, value]) => {
            if (ignoresDeps.includes(name)) return

            let version: string, protocol: string | undefined
            if (value.includes(':')) {
              ;[protocol, version] = value.split(':', 2)
            } else {
              version = value
            }
            if (protocol && ignoreProtocols.includes(protocol)) return

            const key = distinguishType ? `${type}:${name}` : name
            if (globalDeps[key] && globalDeps[key] !== version) {
              deps[name] = globalDeps[key]
            } else globalDeps[key] = version
          })
        }

        return data
      },
    },
  ])
}
