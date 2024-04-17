import { CameraConstructor } from '../../constructors'
import { BabylonAccessor } from '../../models'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'
import { SceneStateType } from './scene-state-type'

export function SceneState(props: SceneStateProps): any {
  return function <T extends { new (...args: any[]): SceneStateType }>(constructor: T & SceneStateType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneStateCore, SceneStateInterface {
      props = props
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null }

      useCamera(camera: CameraConstructor): void {

      }

      start(): void {

      }

      end(): void {

      }
    }
    return _class
  }
}
