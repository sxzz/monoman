import { defineCommand, runMain } from 'citty'
import { description, name, version } from '../package.json'
import { run } from '.'

const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  args: {
    write: {
      alias: 'w',
      type: 'boolean',
      default: true,
      description: 'Write the files if they are not up to date',
    },
    check: {
      alias: 'c',
      type: 'boolean',
      default: false,
      description: 'Check if the files are up to date',
    },
  },
  run: (ctx) => {
    return run({
      write: ctx.args.write,
      check: ctx.args.check,
    })
  },
})

export const runCli = (): Promise<void> => runMain(main)
