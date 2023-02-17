import type { Config } from './types'

export function defineConfig(config: Config): Config {
  return config
}

export * from './types'
export * from './cli'

// const cli = cac('monoman')
// const parsed = cli.parse()
// console.log(parsed)
