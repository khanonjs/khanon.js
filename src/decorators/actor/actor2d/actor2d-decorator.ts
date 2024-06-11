import {
  LoadingProgress,
  Spawnable
} from '../../../base'
import { Actor2DConstructor } from '../../../constructors/actor2d-constructor'
import {
  ActorsController,
  SpritesController
} from '../../../controllers'
import { removeArrayDuplicitiesInObject } from '../../../helpers/utils'
import { SceneType } from '../../scene/scene-type'
import { Actor2DCore } from './actor2d-core'
import { Actor2DInterface } from './actor2d-interface'
import { Actor2DProps } from './actor2d-props'

export function Actor2D(props: Actor2DProps = {}): any {
  return function <T extends { new (...args: any[]): Actor2DInterface }>(constructor: T & Actor2DInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements Actor2DInterface {
      onLoaded?(): void {}
    }
    const _classCore = class implements Actor2DCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: Actor2DInterface = new _classInterface()
      loaded = false

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        SpritesController.load(this.props.sprites, scene)
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
