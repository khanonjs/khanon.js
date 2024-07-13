import { ScenesController } from './controllers'
import { Core } from './core'
import { Timeout } from './models/timeout'

export class KJS {
  static get Scene(): ScenesController { return ScenesController }

  static throw(error?: any): void {
    Core.throw(error)
  }

  static clearCache(): void {
    // TODO
  }

  static setTimeout(func: () => void, mms: number): Timeout {
    return Core.setTimeout(func, mms)
  }

  static setInterval(func: () => void, mms: number): Timeout {
    return Core.setInterval(func, mms)
  }

  static clearTimeout(timeout: Timeout): void {
    Core.clearTimeout(timeout)
  }

  static clearInterval(timeout: Timeout): void {
    Core.clearInterval(timeout)
  }
}

export default KJS
