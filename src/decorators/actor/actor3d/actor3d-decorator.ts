import { ActorsController } from '../../../controllers/actors-controller'
import { Actor3DCore } from './actor3d-core'
import { Actor3DProps } from './actor3d-props'

export function Actor3D(props: Actor3DProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & Actor3DCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements Actor3DCore {
      props = props
    }
    ActorsController.registerActor(_class)
    return _class
  }
}
