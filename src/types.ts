import type { Arrayable, Awaitable } from '@antfu/utils'

export interface Context {
  filePath: string
  files: string[]
}

export type Config = ({
  include: Arrayable<string>
  exclude?: Arrayable<string>
} & (
  | {
      type: 'text'
      contents?: (text: string | null, context: Context) => Awaitable<string>
    }
  | {
      type: 'json'
      contents?: (data: any, context: Context) => Awaitable<unknown>
    }
))[]
