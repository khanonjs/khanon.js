import { Observer } from '@babylonjs/core'

import { CameraConstructor } from '../../../constructors/camera-constructor'
import { SceneStatesController } from '../../../controllers'
import {
  Rect,
  UseCamera
} from '../../../models'
import { Logger } from '../../../modules'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneType } from '../scene-type'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export function SceneState(props: SceneStateProps): any {
  return function <T extends { new (...args: any[]): SceneStateInterface }>(constructor: T & SceneStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SceneStateInterface {
      constructor(readonly scene: SceneType) {
        super()
      }

      props = props
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>

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
        Logger.debug('SceneState start', _classInterface.prototype)
        if (this.props.useCamera === UseCamera.ON_START ||
            (this.props.useCamera === UseCamera.INHERIT && !this.scene.babylon.scene.activeCamera)) {
          this.setCamera(this.props.camera)
        }
        invokeCallback(this.onStart, this, this.scene)
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      end(): void {
        Logger.debug('SceneState end', _classInterface.prototype)
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this, this.scene)
      }
    }
    const _classCore = class implements SceneStateCore {
      props = props
      Instance: SceneStateInterface = new _classInterface(null)

      spawn(scene: SceneType): SceneStateInterface {
        const state = new _classInterface(scene)
        return state
      }
    }
    SceneStatesController.register(new _classCore())
    return _classInterface
  }
}
