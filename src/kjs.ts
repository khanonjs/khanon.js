import * as BABYLON from '@babylonjs/core'

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

  static setTimeout(func: () => void, ms: number, context?: any): Timeout {
    return Core.setTimeout(func, ms, context)
  }

  static setInterval(func: () => void, ms: number, context?: any): Timeout {
    return Core.setInterval(func, ms, context)
  }

  static clearTimeout(timeout: Timeout): void {
    Core.clearTimeout(timeout)
  }

  static clearInterval(timeout: Timeout): void {
    Core.clearInterval(timeout)
  }

  static loopUpdateAddObserver(func: (delta: number) => void): BABYLON.Observer<number> {
    return Core.loopUpdateAddObserver(func)
  }

  static loopUpdateRemoveObserver(observer: BABYLON.Observer<number>): void {
    Core.loopUpdateRemoveObserver(observer)
  }
}

export default KJS
