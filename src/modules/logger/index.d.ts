// 8a8f meter esto en KJS

export enum LoggerLevels {
  NO_LOGS = -1,
  ERROR = 3,
  WARNING = 4,
  INFO = 6,
  DEBUG = 7,
  TRACE = 8
}
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
