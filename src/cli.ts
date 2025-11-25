import { cac, type CAC } from 'cac'
import { description, name, version } from '../package.json'
import { run } from '.'

export const cli: CAC = cac(name).version(version).help()

cli
  .command('', description)
  .option('-w, --write', 'Write the files if they are not up to date', {
    default: true,
  })
  .option('-c, --check', 'Check if the files are up to date', {
    default: false,
  })
  .action((options) => run(options))

export function runCLI(): void {
  cli.parse()
}
