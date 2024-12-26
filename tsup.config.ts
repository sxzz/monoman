import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  target: 'node18.12',
  clean: true,
  dts: true,
  shims: true,
})
