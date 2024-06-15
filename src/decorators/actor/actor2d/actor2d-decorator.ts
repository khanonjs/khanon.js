import { LoadingProgress } from '../../../base'
import {
  ActorsController,
  SpritesController
} from '../../../controllers'
import {
  cloneClass,
  invokeCallback,
  removeArrayDuplicitiesInObject
} from '../../../helpers/utils'
import { Logger } from '../../../modules'
import { SceneType } from '../../scene/scene-type'
import { ActorInterface } from '../actor-interface'
import { Actor2DCore } from './actor2d-core'
import { Actor2DInterface } from './actor2d-interface'
import { Actor2DProps } from './actor2d-props'

export function Actor2D(props: Actor2DProps = {}): any {
  return function <T extends { new (...args: any[]): Actor2DInterface }>(constructor: T & Actor2DInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements Actor2DInterface {
      // compositions?: Map<string, () => any>
      onLoaded?(): void {}
      onSpawn?(): void {}

      useComposition<C = any>(id: string): C {
        Logger.trace('aki Actor3D useComposition', id)
        if (!this.compositions.get(id)) { Logger.debugError(`Actor composition not found: ${id}`, this) }
        return this.compositions.get(id)()
      }
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

      compose() {
        return []
      }

      spawn(): ActorInterface {
        const actor = cloneClass(this.Instance)
        invokeCallback(actor.onSpawn, actor)
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
