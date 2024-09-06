import type { Config } from '../types'
import type { Arrayable } from '@antfu/utils'
import type { Lockfile } from '@pnpm/lockfile.types'

export function noDuplicatedPnpmLockfile({
  include = 'pnpm-lock.yaml',
  exclude,
  deps = [],
  allowMajor,
}: {
  /** Include files */
  include?: Arrayable<string>
  /** Exclude files */
  exclude?: Arrayable<string>
  /** Deps to check */
  deps?: Arrayable<string>
  allowMajor?: boolean
} = {}): Config {
  const depsVersion: Record<string, string> = Object.create(null)
  return [
    {
      include,
      exclude,
      type: 'yaml',
      dumpOptions: {
        // @ts-ignore
        blankLines: true,
        lineWidth: -1, // This is setting line width to never wrap
        noCompatMode: true,
        noRefs: true,
        sortKeys: false,
      },
      contents(data: Lockfile) {
        const { lockfileVersion } = data
        if (typeof lockfileVersion !== 'string' || lockfileVersion[0] !== '9') {
          console.warn(
            'Only support pnpm v9 lockfile, but got',
            lockfileVersion,
          )
          return data
        }
        const pkgs = Object.keys(data.packages || {})

        for (const pkg of pkgs) {
          const names = pkg.split('@')

          const version = names.pop()!
          let name = names.join('@')
          if (!deps.includes(name)) continue

          const major = version.split('.')[0]
          if (allowMajor) {
            name += `@${major}`
          }

          const existingVersion = depsVersion[name]
          if (existingVersion && existingVersion !== version) {
            throw new Error(
              `Duplicated package "${name}" found with different versions: ${existingVersion} and ${version}`,
            )
          }
          depsVersion[name] = version
        }

        return data
      },
    },
  ]
}
