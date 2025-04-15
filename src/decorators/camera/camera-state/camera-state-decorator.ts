import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { CameraStatesController } from '../../../controllers'
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { Logger } from '../../../modules/logger'
import { FlexId } from '../../../types/flex-id'
import {
  attachCanvasResize,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneInterface } from '../../scene/scene-interface'
import { CameraInterface } from '../camera-interface'
import { CameraStateConstructor } from './camera-state-constructor'
import { CameraStateCore } from './camera-state-core'
import { CameraStateInterface } from './camera-state-interface'
import { CameraStateProps } from './camera-state-props'

export function CameraState(props: CameraStateProps = {}): any {
  return function <T extends { new (...args: any[]): CameraStateInterface }>(constructor: T & CameraStateInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements CameraStateInterface {
      constructor(readonly camera: CameraInterface, props: CameraStateProps) {
        super()
        if (this.camera) {
          this._props = props
          this.camera = camera
          this.scene = this.camera.scene
          this.babylon.scene = this.camera.babylon.scene
          this._metadata.applyProps(this, this.scene)
        }
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _props: CameraStateProps
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _loopUpdate = true
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>
      scene: SceneInterface
      setup: any

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      switchState(state: CameraStateConstructor, setup: any): CameraStateInterface {
        return this.camera.switchState(state, setup)
      }

      _start(setup: any): void {
        Logger.debug('CameraState start', this.getClassName(), this.camera.getClassName())
        this.setup = setup
        invokeCallback(this.onStart, this)
        this._metadata.startInputEvents()
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
      }

      _end(): void {
        this.clearAllTimeouts()
        this._metadata.stopInputEvents()
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    const _classCore = class implements CameraStateCore {
      props = props
      Instance: CameraStateInterface = new _classInterface(null as any, null as any)

      spawn(camera: CameraInterface): CameraStateInterface {
        const state = new _classInterface(camera, this.props)
        return state
      }

      _load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().complete()
      }

      _unload(scene: SceneInterface): void {
      }

      getClassName(): string {
        return className
      }
    }
    CameraStatesController.register(new _classCore())
    return _classInterface
  }
}
