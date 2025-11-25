import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts', 'src/run.ts'],
  dts: { resolve: ['@antfu/utils'] },
  inlineOnly: ['@antfu/utils'],
  exports: true,
})
