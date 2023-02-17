// import { cac } from 'cac'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import { loadConfig } from 'unconfig'
import glob from 'fast-glob'
import { toArray } from '@antfu/utils'
import type { Config } from './types'

export async function runCli() {
  const config = await getConfig()

  for (const item of Array.from(config)) {
    const files = await glob(item.include, {
      ignore: toArray(item.exclude),
      absolute: true,
    })

    for (const file of files) {
      let contents = await readFile(file, 'utf-8').catch(() => null)
      const exists = contents !== null
      if (item.type === 'text') {
        if (item.write) {
          contents = await item.write(contents)
        }
      } else if (item.type === 'json') {
        // eslint-disable-next-line unicorn/no-lonely-if
        if (item.write) {
          contents = JSON.stringify(
            await item.write(contents ? JSON.parse(contents) : null),
            null,
            2
          )
        }
      }

      if (contents !== null) {
        await writeFile(file, contents, 'utf-8')
      } else if (exists) {
        await unlink(file)
      }
    }
  }
}

async function getConfig() {
  const { config } = await loadConfig<Config>({
    defaults: [],
    sources: [
      {
        files: 'monoman.config',
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
    ],
  })
  return Object.values(config)
}
