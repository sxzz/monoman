import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/index.ts',
  dts: { resolve: ['@antfu/utils'] },
})
