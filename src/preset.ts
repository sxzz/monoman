import { type Arrayable } from '@antfu/utils'
import { defineConfig } from '.'

export function dedupeDeps({
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
} = {}) {
  const globalDeps: Record<string, string> = Object.create(null)
  return defineConfig([
    {
      include,
      exclude,
      type: 'json',
      contents(data: Record<string, any>) {
        if (!data) return

        for (const type of types) {
          const deps: Record<string, string> = data[type] || {}
          Object.entries(deps).forEach(([name, value]) => {
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
