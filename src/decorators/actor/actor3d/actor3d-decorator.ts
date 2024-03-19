import { Actor3DConstructor } from '../../../constructors'
import { ActorsController } from '../../../controllers/actors-controller'
import { LoadingProgress } from '../../../models'
import { Actor3DCore } from './actor3d-core'
import { Actor3DInterface } from './actor3d-interface'
import { Actor3DProps } from './actor3d-props'

export function Actor3D(props: Actor3DProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & Actor3DCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements Actor3DCore {
      // Core
      props = props
      Interface: Actor3DConstructor = Actor3DInterface

      load(): LoadingProgress {
        return {} as any
      }

      unload(): void {

      }
    }
    ActorsController.register(_class)
    return _class
  }
}
