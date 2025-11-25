import { defineConfig } from './src/index'
import { noDuplicatedDeps, noDuplicatedPnpmLockfile } from './src/presets'

export default defineConfig([
  {
    include: 'package.json',
    type: 'json',
    contents(data: any) {
      data.name = 'monoman'
      return data
    },
  },
  ...noDuplicatedDeps(),
  ...noDuplicatedPnpmLockfile({
    deps: ['chalk'],
  }),
])
