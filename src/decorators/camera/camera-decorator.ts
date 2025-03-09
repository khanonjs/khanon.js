import * as BABYLON from '@babylonjs/core'

import { Metadata } from '../../base'
import { CamerasController } from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  attachCanvasResize,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { SceneInterface } from '../scene/scene-interface'
import { CameraCore } from './camera-core'
import { CameraInterface } from './camera-interface'
import { CameraProps } from './camera-props'

// TODO add CameraAction
export function Camera(props: CameraProps = {}): any {
  return function <T extends { new (...args: any[]): CameraInterface }>(constructor: T & CameraInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements CameraInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        if (scene) {
          this.babylon.scene = scene.babylon.scene
          this._metadata.applyProps(this)
        }
      }

      getClassName(): string {
        return className
      }

      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera' | 'scene'> = { camera: null as any, scene: null as any }
      setup: any
      _loopUpdate = true
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      start(): void {
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
        invokeCallback(this.onStart, this)
      }

      stop(): void {
        invokeCallback(this.onStop, this)
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      release(): void {
        this.stop()
        this.babylon.camera.dispose()
      }
    }
    const _classCore = class implements CameraCore {
      Instance: CameraInterface = new _classInterface(null as any)

      spawn(scene: SceneInterface): CameraInterface {
        const camera = new _classInterface(scene)
        return camera
      }

      getClassName(): string {
        return className
      }
    }
    CamerasController.register(new _classCore())
    return _classInterface
  }
}
