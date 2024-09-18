import * as BABYLON from '@babylonjs/core'

import { Metadata } from '../../base'
import { CamerasController } from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { SceneInterface } from '../scene/scene-interface'
import { CameraCore } from './camera-core'
import { CameraInterface } from './camera-interface'

// TODO add CameraAction
export function Camera(): any {
  return function <T extends { new (...args: any[]): CameraInterface }>(constructor: T & CameraInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements CameraInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        if (scene) {
          this.babylon.scene = scene.babylon.scene
          this.metadata.applyProps(this)
        }
      }

      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera' | 'scene'> = { camera: null as any, scene: null as any }
      setup: any
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      start(): void {
        attachLoopUpdate(this)
        attachCanvasResize(this)
        invokeCallback(this.onStart, this)
      }

      stop(): void {
        invokeCallback(this.onStop, this)
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }
    }
    const _classCore = class implements CameraCore {
      Instance: CameraInterface = new _classInterface(null as any)

      spawn(scene: SceneInterface): CameraInterface {
        const camera = new _classInterface(scene)
        return camera
      }
    }
    CamerasController.register(new _classCore())
    return CameraInterface
  }
}
