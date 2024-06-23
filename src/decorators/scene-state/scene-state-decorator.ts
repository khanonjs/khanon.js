import { Observer } from '@babylonjs/core'

import {
  CameraConstructor,
  SceneStateConstructor
} from '../../constructors'
import {
  CamerasController,
  SceneStatesController
} from '../../controllers'
import { Core } from '../../core'
import {
  BabylonAccessor,
  Rect,
  UseCamera
} from '../../models'
import { Logger } from '../../modules'
import {
  cloneClass,
  invokeCallback
} from '../../utils/utils'
import { SceneType } from '../scene/scene-type'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export function SceneState(props: SceneStateProps): any {
  return function <T extends { new (...args: any[]): SceneStateInterface }>(constructor: T & SceneStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SceneStateInterface {
      constructor(readonly scene: SceneType) {
        super()
      }

      // Private
      props = props
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>

      // Public
      onStart?(): void
      onEnd?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

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
        if (this.onLoopUpdate) {
          this.loopUpdate$ = Core.addLoopUpdateObserver(this.onLoopUpdate.bind(this))
        }
        if (this.onCanvasResize) {
          this.canvasResize$ = Core.addCanvasResizeObserver(this.onCanvasResize.bind(this))
        }
      }

      end(): void {
        Logger.debug('SceneState end', _classInterface.prototype)
        if (this.loopUpdate$) {
          Core.removeLoopUpdateObserver(this.loopUpdate$)
          this.loopUpdate$ = undefined
        }
        if (this.canvasResize$) {
          Core.removeCanvasResizeObserver(this.canvasResize$)
          this.canvasResize$ = undefined
        }
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
