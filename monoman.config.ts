import { defineConfig } from './src/index'

export default defineConfig([
  {
    include: 'package.json',
    type: 'json',
    contents(data: any) {
      data.name = 'monoman'
      return data
    },
  },
])
