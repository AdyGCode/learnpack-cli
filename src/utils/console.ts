import * as chalk from 'chalk'

export default {
  // _debug: true,
  _debug: process.env.DEBUG === 'true',
  startDebug: function () {
    this._debug = true
  },
  log: (msg: string | Array<string>, ...args: Array<any>) =>
    console.log(chalk.gray(msg), ...args),
  error: (msg: string, ...args: Array<any>) =>
    console.log(chalk.red('⨉ ' + msg), ...args),
  success: (msg: string, ...args: Array<any>) =>
    console.log(chalk.green('✓ ' + msg), ...args),
  info: (msg: string, ...args: Array<any>) =>
    console.log(chalk.blue('ⓘ ' + msg), ...args),
  help: (msg: string) =>
    console.log(`${chalk.white.bold('⚠ help:')} ${chalk.white(msg)}`),
  debug(...args: Array<any>) {
    this._debug && console.log(chalk.magentaBright('⚠ debug: '), args)
  },
}
