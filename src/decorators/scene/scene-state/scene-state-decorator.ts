import { Observer } from '@babylonjs/core'

import { CameraConstructor } from '../../../constructors/camera-constructor'
import { SceneStatesController } from '../../../controllers'
import { Rect } from '../../../models/rect'
import { UseCamera } from '../../../models/use-camera'
import { Logger } from '../../../modules/logger'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneMetadata } from '../scene-metadata'
import { SceneType } from '../scene-type'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export function SceneState(props: SceneStateProps): any {
  return function <T extends { new (...args: any[]): SceneStateInterface }>(constructor: T & SceneStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SceneStateInterface {
      constructor(readonly scene: SceneType, readonly setup: any) {
        super()
        this.metadata.applyProps(this)
      }

      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>
      metadata: SceneMetadata = Reflect.getMetadata('metadata', this) ?? new SceneMetadata()

      onStart?(): void
      onEnd?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      setCamera(camera: CameraConstructor): void {
        this.scene.setCamera(camera)
      }

      start(): void {
        Logger.debug('SceneState start', _classInterface.prototype, this.scene.constructor.prototype)
        if (props.useCamera === UseCamera.ON_START ||
            (props.useCamera === UseCamera.INHERIT && !this.scene.babylon.scene.activeCamera)) {
          this.setCamera(props.camera)
        }
        invokeCallback(this.onStart, this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      end(): void {
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }
    }
    const _classCore = class implements SceneStateCore {
      props = props
      Instance: SceneStateInterface = new _classInterface(null, null)

      spawn(scene: SceneType): SceneStateInterface {
        const state = new _classInterface(scene, null)
        return state
      }
    }
    SceneStatesController.register(new _classCore())
    return _classInterface
  }
}
