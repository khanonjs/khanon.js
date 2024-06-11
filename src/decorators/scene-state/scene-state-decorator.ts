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
  cloneClass,
  invokeCallback
} from '../../helpers/utils'
import {
  BabylonAccessor,
  UseCamera
} from '../../models'
import { Logger } from '../../modules'
import { SceneType } from '../scene/scene-type'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export function SceneState(props: SceneStateProps): any {
  return function <T extends { new (...args: any[]): SceneStateInterface }>(constructor: T & SceneStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SceneStateInterface {
      // Private
      props = props

      // Public
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null }

      setCamera(camera: CameraConstructor): void {
        this.scene.setCamera(camera)
      }

      play(scene: SceneType): void {
        Logger.debug('Scene state play', _classInterface.prototype)
        this.scene = scene
        if (this.props.useCamera === UseCamera.ON_START ||
            (this.props.useCamera === UseCamera.INHERIT && !scene.babylon.scene.activeCamera)) {
          this.setCamera(this.props.camera)
        }
        invokeCallback(this.onPlay, this, this.scene)
      }

      end(scene: SceneType): void {
        Logger.debug('Scene state end', _classInterface.prototype)
      }

      // User defined
      onStart?(): void
      onEnd?(): void
      loopUpdate?(delta: number): void
    }
    const _classCore = class implements SceneStateCore {
      props = props
      Instance: SceneStateInterface = new _classInterface()

      spawn(): SceneStateInterface {
        return cloneClass(this.Instance)
      }
    }
    SceneStatesController.register(new _classCore())
    return _classInterface
  }
}
