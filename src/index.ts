import { readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadConfig } from 'unconfig'
import { toArray } from '@antfu/utils'
import consola from 'consola'
import glob from 'fast-glob'
import { type Config, type Context } from './types'

export * from './types'
export * from './cli'

export function defineConfig(config: Config): Config {
  return config
}

export async function run({
  write = true,
  check,
}: {
  check?: boolean
  write?: boolean
}) {
  const { config, source } = await getConfig()

  for (const item of Array.from(config)) {
    const files = await glob(item.include, {
      ignore: toArray(item.exclude),
      absolute: true,
      cwd: path.dirname(source),
    })

    for (const filepath of files) {
      if (check) consola.info(`Checking ${filepath}`)

      const context: Context = { files, filepath }

      const actual = await readFile(filepath, 'utf-8').catch(() => null)
      let expected: string | null | undefined

      if (item.type === 'text') {
        if (item.contents) expected = await item.contents(actual, context)
      } else if (item.type === 'json' && item.contents) {
        expected = `${JSON.stringify(
          await item.contents(actual ? JSON.parse(actual) : null, context),
          null,
          2
        )}\n`
      }

      if (expected === actual) continue

      if (check) {
        if (expected === null) {
          throw new TypeError(`File ${filepath} should be deleted but exists`)
        } else {
          consola.fatal(
            `File ${filepath} is not up to date, run with --write to update it.`
          )
          process.exit(1)
        }
      } else if (write) {
        if (expected === null) {
          // should be deleted
          await unlink(filepath)
        } else if (expected !== undefined)
          await writeFile(filepath, expected, 'utf-8')
      }
    }
  }

  if (check) consola.success('Check passed!')
  else if (write) consola.success('Files are up to date!')
}

export async function getConfig() {
  const { config, sources } = await loadConfig<Config>({
    defaults: [],
    sources: [
      {
        files: 'monoman.config',
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
    ],
  })
  return {
    config: Object.values(config),
    source: sources[0],
  }
}
