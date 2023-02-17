import type { Arrayable, Awaitable } from '@antfu/utils'

export type Config = ({
  include: Arrayable<string>
  exclude?: Arrayable<string>
} & (
  | { type: 'text'; write?(text: string | null): Awaitable<string | null> }
  | { type: 'json'; write?(data: unknown | null): Awaitable<unknown> }
))[]
