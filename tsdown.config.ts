import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: { resolve: ['@antfu/utils'] },
  inlineOnly: ['@antfu/utils'],
  exports: true,
})
