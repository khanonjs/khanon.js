import { LoadingProgress } from '../../../base'
import { Actor3DConstructor } from '../../../constructors'
import { ActorsController } from '../../../controllers'
import { removeArrayDuplicitiesInObject } from '../../../helpers/utils'
import { SceneType } from '../../scene/scene-type'
import { Actor3DCore } from './actor3d-core'
import { Actor3DInterface } from './actor3d-interface'
import { Actor3DProps } from './actor3d-props'

export function Actor3D(props: Actor3DProps): any {
  return function <T extends { new (...args: any[]): Actor3DInterface }>(constructor: T & Actor3DInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements Actor3DInterface {
      onLoaded?(): void {}
    }
    const _classCore = class implements Actor3DCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: Actor3DInterface = new _classInterface()
      loaded = false

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        // SpritesController.load(this.props.sprites, scene)
        // 8a8f Load  the rest of props
        return progress
      }

      unload(): void {

      }

      spawn(): void {

      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
