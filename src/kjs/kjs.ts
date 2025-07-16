

import { Core } from '../base/core/core'
import { LoadingProgress } from '../base/loading-progress/loading-progress'
import {
  NotificationsController,
  ScenesController,
  SoundsController
} from '../controllers'
import { AppInterface } from '../decorators/app/app-interface'
import { AppStateConstructor } from '../decorators/app/app-state/app-state-constructor'
import { Rect } from '../models/rect'
import { Arrays } from '../modules/helper/arrays'
import { Maths } from '../modules/helper/maths'
import { Vectors } from '../modules/helper/vectors'

export class KJS {
  static get Scene(): ScenesController { return ScenesController }
  static get Notify(): NotificationsController { return NotificationsController }
  static get Sound(): SoundsController { return SoundsController }
  static get Arrays(): Arrays { return Arrays }
  static get Maths(): Maths { return Maths }
  static get Vectors(): Vectors { return Vectors }

  static throw(error?: any): void {
    Core.throw(error)
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
