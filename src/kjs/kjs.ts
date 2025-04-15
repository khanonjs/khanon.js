import * as BABYLON from '@babylonjs/core'

import { Core } from '../base/core/core'
import { LoadingProgress } from '../base/loading-progress/loading-progress'
import {
  NotificationsController,
  ScenesController
} from '../controllers'
import { AppInterface } from '../decorators/app/app-interface'
import { AppStateConstructor } from '../decorators/app/app-state/app-state-constructor'
import { Rect } from '../models/rect'

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
