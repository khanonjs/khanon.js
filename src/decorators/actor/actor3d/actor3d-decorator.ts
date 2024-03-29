import { LoadingProgress } from '../../../base'
import { Actor3DConstructor } from '../../../constructors'
import { ActorsController } from '../../../controllers/actors-controller'
import { Actor3DCore } from './actor3d-core'
import { Actor3DInterface } from './actor3d-interface'
import { Actor3DProps } from './actor3d-props'

export function Actor3D(props: Actor3DProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & Actor3DCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements Actor3DCore {
      props = props
      Instance: Actor3DConstructor = Actor3DInterface
      loaded = false

      load(): LoadingProgress {
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
