import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'
import { Ray } from '@babylonjs/core/Culling/ray'
import {
  Matrix,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import { Observer } from '@babylonjs/core/Misc/observable'

import { Metadata } from '../../base'
import { Core } from '../../base/core/core'
import {
  CamerasController,
  CameraStatesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
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
import { CameraStateConstructor } from './camera-state/camera-state-constructor'
import { CameraStateInterface } from './camera-state/camera-state-interface'

// FEAT add CameraAction
export function Camera(props: CameraProps = {}): any {
  return function <T extends { new (...args: any[]): CameraInterface }>(constructor: T & CameraInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements CameraInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        if (scene) {
          this.babylon.scene = scene.babylon.scene
          this._metadata.applyProps(this, this.scene)
        }
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      babylon: Pick<BabylonAccessor<TargetCamera>, 'camera' | 'scene'> = { camera: null as any, scene: null as any }
      setup: any
      _state: CameraStateInterface | null
      _loopUpdate = true
      _loopUpdate$: Observer<number>
      _canvasResize$: Observer<Rect>

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      get state(): CameraStateInterface | null { return this._state }

      // Transform
      get position(): Vector3 { return this.babylon.camera.position }
      set position(value: Vector3) { this.babylon.camera.position = value }
      get globalPosition(): Vector3 { return this.babylon.camera.globalPosition }
      get upVector(): Vector3 { return this.babylon.camera.upVector }
      set upVector(value: Vector3) { this.babylon.camera.upVector = value }
      getDirection(localAxis: Vector3): Vector3 { return this.babylon.camera.getDirection(localAxis) }
      getDirectionToRef(localAxis: Vector3, result: Vector3): void { return this.babylon.camera.getDirectionToRef(localAxis, result) }
      getForwardRay(length?: number, transform?: Matrix, origin?: Vector3): Ray { return this.babylon.camera.getForwardRay(length, transform, origin) }
      getProjectionMatrix(force?: boolean): Matrix { return this.babylon.camera.getProjectionMatrix(force) }
      getWorldMatrix(): Matrix { return this.babylon.camera.getWorldMatrix() }
      get rotation(): Vector3 { return this.babylon.camera.rotation }
      set rotation(value: Vector3) { this.babylon.camera.rotation = value }
      get speed(): number { return this.babylon.camera.speed }
      set speed(value: number) { this.babylon.camera.speed = value }
      get target(): Vector3 { return this.babylon.camera.target }
      set target(value: Vector3) { this.babylon.camera.target = value }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      switchState(state: CameraStateConstructor, setup: any): CameraStateInterface {
        const _state = CameraStatesController.get(state).spawn(this)
        if (this._state) {
          this._state._end()
        }
        this._state = _state
        this._state._start(setup)
        return this._state
      }

      _start(): void {
        this._metadata.startInputEvents()
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
        invokeCallback(this.onStart, this)
      }

      _stop(): void {
        this._metadata.stopInputEvents()
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
    CamerasController.register(_classInterface, new _classCore())
    return _classInterface
  }
}
