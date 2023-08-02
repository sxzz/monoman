import { type Arrayable, type Awaitable } from '@antfu/utils'

export interface Context {
  filepath: string
  files: string[]
}

export type Config = ({
  include: Arrayable<string>
  exclude?: Arrayable<string>
} & (
  | {
      type: 'text'
      write?(text: string | null, context: Context): Awaitable<string>
    }
  | {
      type: 'json'
      write?(data: unknown | null, context: Context): Awaitable<unknown>
    }
))[]
