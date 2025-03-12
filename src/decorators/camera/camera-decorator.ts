import * as BABYLON from '@babylonjs/core'

import { Metadata } from '../../base'
import { Core } from '../../base/core/core'
import { CamerasController } from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
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

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearTimeout(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

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

      _start(): void {
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
        invokeCallback(this.onStart, this)
      }

      _stop(): void {
        invokeCallback(this.onStop, this)
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      _release(): void {
        this.clearAllTimeouts()
        this._stop()
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
