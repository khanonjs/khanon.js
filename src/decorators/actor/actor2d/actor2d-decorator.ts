import { LoadingProgress } from '../../../base'
import { Actor2DConstructor } from '../../../constructors/actor2d-constructor'
import { ActorsController } from '../../../controllers/actors-controller'
import { SpritesController } from '../../../controllers/sprites-controller'
import { SceneType } from '../../scene/scene-type'
import { Actor2DCore } from './actor2d-core'
import { Actor2DInterface } from './actor2d-interface'
import { Actor2DProps } from './actor2d-props'
import { Actor2DType } from './actor2d-type'

export function Actor2D(props: Actor2DProps): any {
  return function <T extends { new (...args: any[]): Actor2DType }>(constructor: T & Actor2DType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements Actor2DCore {
      props = props
      Instance: Actor2DConstructor = Actor2DInterface // 8a8f
      loaded = false

      load(scene: SceneType): LoadingProgress {
        console.log('aki ACTOR 2D LOAD', scene)
        // 8a8f Load  the rest of props
        return SpritesController.load(this.props.sprites, scene)
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
