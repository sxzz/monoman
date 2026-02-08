import { nodeLib } from 'tsdown-preset-sxzz'

export default nodeLib({
  entry: ['src/*.ts', '!src/types.ts'],
  inlineDeps: ['@antfu/utils'],
})
