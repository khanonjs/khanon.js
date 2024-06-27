import {
  Camera as BabylonCamera,
  Observer
} from '@babylonjs/core'

import { CameraConstructor } from '../../constructors'
import { CamerasController } from '../../controllers'
import { Core } from '../../core'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import {
  attachCanvasResize,
  attachLoopUpdate,
  removeCanvasResize,
  removeLoopUpdate
} from '../../utils/utils'
import { CameraCore } from './camera-core'
import { CameraInterface } from './camera-interface'

export function Camera(): any {
  return function <T extends { new (...args: any[]): CameraInterface }>(constructor: T & CameraInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements CameraInterface {
      babylon: Pick<BabylonAccessor<BabylonCamera>, 'camera'> = { camera: null }
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>

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
