import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts', '!src/types.ts'],
  dts: { resolve: ['@antfu/utils'] },
  inlineOnly: ['@antfu/utils'],
  exports: true,
})
