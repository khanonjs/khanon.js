import { Actor2DConstructor } from '../../../constructors/actor2d-constructor'
import { ActorsController } from '../../../controllers/actors-controller'
import { SpritesController } from '../../../controllers/sprites-controller'
import { LoadingProgress } from '../../../models'
import { SceneType } from '../../scene/scene-type'
import { Actor2DCore } from './actor2d-core'
import { Actor2DInterface } from './actor2d-interface'
import { Actor2DProps } from './actor2d-props'

export function Actor2D(props: Actor2DProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & Actor2DCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements Actor2DCore {
      props = props
      Instance: Actor2DConstructor = Actor2DInterface
      loaded = false

      load(scene: SceneType): LoadingProgress {
        console.log('aki ACTOR 2D LOAD')
        SpritesController.load(this.props.sprites, scene)
        // 8a8f Load  the rest of props
        return {} as any
      }

      unload(): void {

      }

      spawn(): void {

      }
    }
    ActorsController.register(new _class())
    return _class
  }
}
