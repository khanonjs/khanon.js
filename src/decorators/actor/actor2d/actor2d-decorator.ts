import { ActorsController } from '../../../controllers/actors-controller'
import { Actor2DCore } from './actor2d-core'
import { Actor2DProps } from './actor2d-props'

export function Actor2D(props: Actor2DProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & Actor2DCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements Actor2DCore {
      props = props
    }
    ActorsController.registerActor(_class)
    return _class
  }
}
