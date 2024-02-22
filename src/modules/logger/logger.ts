import chalk from 'chalk'

import { LoggerLevels } from './logger-levels'

export class Logger {
  private static _level: LoggerLevels = LoggerLevels.DEBUG
  private static boldStyle = 'font-weight: bold; padding: 2px 5px 2px 5px; border-radius: 5px'

  static get level(): LoggerLevels { return this._level }
  static set level(value: LoggerLevels) { this._level = value }

  static error(msg: string, ...params: any[]) {
    if (Logger.level >= LoggerLevels.ERROR) {
      console.log.apply(console, ['%c' + chalk.red(msg), 'background: #ffc2c2; color: #550000;' + Logger.boldStyle, ...params])
    }
  }

  static warn(msg: string, ...params: any[]) {
    if (Logger.level >= LoggerLevels.WARNING) {
      console.log.apply(console, ['%c' + chalk.yellow(msg), 'color: #f5f102', ...params])
    }
  }

  static info(msg: string, ...params: any[]) {
    if (Logger.level >= LoggerLevels.INFO) {
      console.log.apply(console, [msg, ...params])
    }
  }

  static debug(msg: string, ...params: any[]) {
    if (Logger.level >= LoggerLevels.DEBUG) {
      console.log.apply(console, ['%c' + chalk.green(msg), 'background: #d7ffd6; color: #014001;' + Logger.boldStyle, ...params])
    }
  }
}
