/* eslint-disable no-useless-call */
import { LoggerLevels } from './logger-levels'

export class Logger {
  private static _level: LoggerLevels = LoggerLevels.TRACE
  private static boldStyle = 'font-weight: bold; padding: 2px 5px 2px 5px; border-radius: 5px'

  static get level(): LoggerLevels { return this._level }
  static set level(value: LoggerLevels) { this._level = value }

  static error(msg: string, ...params: any[]) {
    if (Logger.level >= LoggerLevels.ERROR) {
      console.log.apply(console, ['%c' + msg, 'background: #ffc2c2; color: #550000;' + Logger.boldStyle, ...params])
    }
  }

  static warn(msg: string, ...params: any[]) {
    if (Logger.level >= LoggerLevels.WARNING) {
      console.log.apply(console, ['%c' + msg, 'color: #f5f102', ...params])
    }
  }

  static info(msg: string, ...params: any[]) {
    if (Logger.level >= LoggerLevels.INFO) {
      console.log.apply(console, [msg, ...params])
    }
  }

  // FEAT: Add posibility to hide a debug log depending on an Id (so there's an Id list that the user can supply)
  static debug(msg: string, ...params: any[]) {
    if (process.env.NODE_ENV !== 'production' && Logger.level >= LoggerLevels.DEBUG) {
      console.log.apply(console, ['%c' + msg, 'background: #d7ffd6; color: #014001;' + Logger.boldStyle, ...params])
    }
  }

  static debugError(msg: string, ...params: any[]) {
    if (process.env.NODE_ENV !== 'production' && Logger.level >= LoggerLevels.DEBUG) {
      console.log.apply(console, ['%c' + msg, 'background: #ffc2c2; color: #550000;' + Logger.boldStyle, ...params])
    }
  }

  static trace(msg: string, ...params: any[]) {
    if (process.env.NODE_ENV !== 'production' && Logger.level >= LoggerLevels.TRACE) {
      console.log.apply(console, ['%c' + msg, 'background: #e010e0; color: #240524;' + Logger.boldStyle, ...params])
    }
  }
}
