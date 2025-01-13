import { toArray, type Arrayable } from '@antfu/utils'
import type { Config } from '../types'

export function noDuplicatedDeps({
  include = ['package.json', 'packages/*/package.json'],
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
} = {}): Config {
  const globalDeps: Record<string, string> = Object.create(null)
  const ignoresDeps = toArray(ignores)
  return [
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

            const protocol: string | undefined = value.includes(':')
              ? value.split(':')[0]
              : undefined
            if (protocol && ignoreProtocols.includes(protocol)) return

            const key = distinguishType ? `${type}:${name}` : name
            if (key in globalDeps && globalDeps[key] !== value) {
              deps[name] = globalDeps[key]
            } else {
              globalDeps[key] = value
            }
          })
        }

        return data
      },
    },
  ]
}
