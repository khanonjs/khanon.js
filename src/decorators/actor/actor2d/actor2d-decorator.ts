import { Actor2DConstructor } from '../../../constructors/actor2d-constructor'
import { ActorsController } from '../../../controllers/actors-controller'
import { LoadingProgress } from '../../../models'
import { Actor2DCore } from './actor2d-core'
import { Actor2DInterface } from './actor2d-interface'
import { Actor2DProps } from './actor2d-props'

export function Actor2D(props: Actor2DProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & Actor2DCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements Actor2DCore {
      // Core
      props = props
      Interface: Actor2DConstructor = Actor2DInterface

      load(): LoadingProgress {
        return {} as any
      }

      unload(): void {

      }
    }
    ActorsController.register(new _class())
    return _class
  }
}
