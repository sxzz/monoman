import { toArray, type Arrayable } from '@antfu/utils'
import { pnpmMultiVersions, type LockfileObject } from 'pnpm-multi-versions'
import type { Config } from '../types'

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
  deps?: Arrayable<string | RegExp> | ((id: string) => boolean)
  allowMajor?: boolean
} = {}): Config {
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
      contents(data: LockfileObject) {
        const { versionsMap, multipleVersions } = pnpmMultiVersions(data, {
          ignoreMajor: allowMajor,
        })

        let hasError = false
        for (const name of multipleVersions) {
          if (typeof deps === 'function') {
            if (!deps(name)) continue
          } else if (
            !toArray(deps).some((dep) =>
              dep instanceof RegExp ? dep.test(name) : dep === name,
            )
          ) {
            continue
          }

          const versions = [...versionsMap.get(name)!]
          console.error(
            `Duplicated package "${name}" found with different versions: ${versions.join(', ')}`,
          )
          hasError = true
        }

        if (hasError) {
          throw new Error('Duplicated packages found in pnpm-lock.yaml')
        }

        return data
      },
    },
  ]
}
