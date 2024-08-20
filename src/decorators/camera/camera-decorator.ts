import * as BABYLON from '@babylonjs/core'

import { CamerasController } from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import {
  attachCanvasResize,
  attachLoopUpdate,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { SceneInterface } from '../scene/scene-interface'
import { CameraCore } from './camera-core'
import { CameraInterface } from './camera-interface'

export function Camera(): any {
  return function <T extends { new (...args: any[]): CameraInterface }>(constructor: T & CameraInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements CameraInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        if (scene) {
          this.babylon.scene = scene.babylon.scene
        }
      }

      babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera' | 'scene'> = { camera: null, scene: null }
      setup: any
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
      Instance: CameraInterface = new _classInterface(null)

      spawn(scene: SceneInterface): CameraInterface {
        const camera = new _classInterface(scene)
        return camera
      }
    }
    CamerasController.register(new _classCore())
    return CameraInterface
  }
}
