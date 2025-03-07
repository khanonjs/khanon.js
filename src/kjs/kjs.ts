import * as BABYLON from '@babylonjs/core'

import { Core } from '../base/core/core'
import { LoadingProgress } from '../base/loading-progress/loading-progress'
import {
  NotificationsController,
  ScenesController
} from '../controllers'
import { AppInterface } from '../decorators/app/app-interface'
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

  static getApp<A extends AppInterface>(): A {
    return Core.getApp() as any
  }

  static switchAppState(state: AppStateConstructor, setup: any): LoadingProgress {
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

  static clearAllTimeouts(): void {
    Core.clearAllTimeouts()
  }

  static loopUpdateAddObserver(func: (delta: number) => void): BABYLON.Observer<number> {
    return Core.loopUpdateAddObserver(func)
  }

  static loopUpdateRemoveObserver(observer: BABYLON.Observer<number>): void {
    Core.loopUpdateRemoveObserver(observer)
  }

  static canvasResizeAddObserver(func: (size: Rect) => void): BABYLON.Observer<Rect> {
    return Core.canvasResizeAddObserver(func)
  }

  static canvasResizeRemoveObserver(observer: BABYLON.Observer<Rect>): void {
    Core.canvasResizeRemoveObserver(observer)
  }

  static getCanvasRect(): Rect {
    return Core.canvasRect
  }
}

export default KJS
