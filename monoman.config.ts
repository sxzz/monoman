import { defineConfig } from './src/index'

export default defineConfig([
  {
    include: 'package.json',
    type: 'json',
    write(data: any) {
      data.name = 'monoman'
      return data
    },
  },
])
