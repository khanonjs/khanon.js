/**
 * Follow Syslog standards: https://en.wikipedia.org/wiki/Syslog
 */

export enum LoggerLevels {
  NO_LOGS = -1,
  ERROR = 3,
  WARNING = 4,
  INFO = 6,
  DEBUG = 7,
  TRACE = 8
}
