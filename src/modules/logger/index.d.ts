import { LoggerLevels } from './'

export declare class Logger {
  static get level(): LoggerLevels
  static set level(value: LoggerLevels)

  static error(msg: string, ...params: any[]): void
  static warn(msg: string, ...params: any[]): void
  static info(msg: string, ...params: any[]): void
  static debug(msg: string, ...params: any[]): void
  static debugError(msg: string, ...params: any[]): void
  static trace(msg: string, ...params: any[]): void
}
