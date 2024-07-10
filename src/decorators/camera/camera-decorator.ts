import * as BABYLON from '@babylonjs/core'

import { CamerasController } from '../../controllers'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import {
  attachCanvasResize,
  attachLoopUpdate,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { CameraCore } from './camera-core'
import { CameraInterface } from './camera-interface'

export function Camera(): any {
  return function <T extends { new (...args: any[]): CameraInterface }>(constructor: T & CameraInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements CameraInterface {
      babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera'> = { camera: null }
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      start(): void {
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      stop(): void {
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }
    }
    const _classCore = class implements CameraCore {
      Instance: CameraInterface = new _classInterface()

      spawn(): CameraInterface {
        const camera = new _classInterface()
        return camera
      }
    }
    CamerasController.register(new _classCore())
    return CameraInterface
  }
}
