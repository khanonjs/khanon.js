import * as BABYLON from '@babylonjs/core'

import {
  NotificationsController,
  ScenesController
} from '../controllers'
import { Core } from '../core'
import { AppStateConstructor } from '../decorators/app/app-state/app-state-constructor'
import { AppStateInterface } from '../decorators/app/app-state/app-state-interface'
import { Rect } from '../models/rect'
import { Timeout } from '../models/timeout'

export class KJS {
  static get Scene(): ScenesController { return ScenesController }
  static get Notify(): NotificationsController { return NotificationsController }

  static throw(error?: any): void {
    Core.throw(error)
  }

  static clearCache(): void {
    // TODO
  }

  static switchAppState(state: AppStateConstructor, setup: any): AppStateInterface {
    return Core.switchAppState(state, setup)
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

  static addCanvasResizeObserver(func: (size: Rect) => void): BABYLON.Observer<Rect> {
    return Core.addCanvasResizeObserver(func)
  }

  static removeCanvasResizeObserver(observer: BABYLON.Observer<Rect>): void {
    Core.removeCanvasResizeObserver(observer)
  }

  static getCanvasRect(): Rect {
    return Core.canvasRect
  }
}

export default KJS
