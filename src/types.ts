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
      contents?(text: string | null, context: Context): Awaitable<string>
    }
  | {
      type: 'json'
      contents?(data: unknown | null, context: Context): Awaitable<unknown>
    }
))[]
