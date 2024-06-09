import {
  CameraConstructor,
  SceneStateConstructor
} from '../../constructors'
import {
  CamerasController,
  SceneStatesController
} from '../../controllers'
import { Core } from '../../core'
import { cloneClass } from '../../helpers/utils'
import {
  BabylonAccessor,
  UseCamera
} from '../../models'
import { SceneType } from '../scene/scene-type'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export function SceneState(props: SceneStateProps): any {
  return function <T extends { new (...args: any[]): SceneStateInterface }>(constructor: T & SceneStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SceneStateInterface {
      // Private
      props = props
      scene: SceneType

      // Public
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null }

      setCamera(camera: CameraConstructor): void {
        this.scene.setCamera(camera)
      }

      start(scene: SceneType): void {
        this.scene = scene
        if (this.props.useCamera === UseCamera.ON_START ||
            (this.props.useCamera === UseCamera.INHERIT && !scene.babylon.scene.activeCamera)) {
          this.setCamera(this.props.camera)
        }
      }

      end(scene: SceneType): void {

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
