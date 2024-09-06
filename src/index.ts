import process from 'node:process'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { loadConfig } from 'unconfig'
import { toArray } from '@antfu/utils'
import consola from 'consola'
import glob from 'fast-glob'
import type { Config, Context } from './types'

export * from './presets'
export * from './types'
export * from './cli'

const require = createRequire(import.meta.url)
const yaml = require('js-yaml')

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

    for (const filePath of files) {
      if (check) consola.info(`Checking ${filePath}`)

      const context: Context = { files, filePath }

      const actual = await readFile(filePath, 'utf-8').catch(() => null)
      let expected: string | null | undefined

      if (item.type === 'text') {
        if (item.contents) expected = await item.contents(actual, context)
      } else if (item.type === 'json' && item.contents) {
        expected = `${JSON.stringify(
          await item.contents(actual ? JSON.parse(actual) : null, context),
          null,
          2,
        )}\n`
      } else if (item.type === 'yaml' && item.contents) {
        expected = yaml.dump(
          await item.contents(actual ? yaml.load(actual) : null, context),
          item.dumpOptions,
        )
      }

      if (expected === actual) continue

      if (check) {
        if (expected === null) {
          throw new TypeError(`File ${filePath} should be deleted but exists`)
        } else {
          consola.fatal(
            `File ${filePath} is not up to date, run with --write to update it.`,
          )
          process.exit(1)
        }
      } else if (write) {
        if (expected === null) {
          // should be deleted
          await unlink(filePath)
        } else if (expected !== undefined)
          await writeFile(filePath, expected, 'utf-8')
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
        files: ['monoman.config', 'mono.config'],
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
    ],
  })
  return {
    config: Object.values(config),
    source: sources[0],
  }
}
