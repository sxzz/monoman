import { defineConfig } from './src/index'

export default defineConfig([
  {
    include: 'LICENSE',
    exclude: [],
    type: 'text',
    write(text) {
      return `${text}LICENSE`
    },
  },
  {
    include: 'package.json',
    type: 'json',
    write(data: any) {
      data.name = 'monoman'
      return data
    },
  },
])
