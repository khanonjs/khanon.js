import { LoadingProgress } from '../../../base'
import { ActorsController } from '../../../controllers'
import { ActorCompositionsController } from '../../../controllers/actor-compositions-controller'
import {
  cloneClass,
  invokeCallback,
  removeArrayDuplicitiesInObject
} from '../../../helpers/utils'
import { Logger } from '../../../modules'
import { SceneType } from '../../scene/scene-type'
import { ActorInterface } from '../actor-interface'
import { Actor3DCore } from './actor3d-core'
import { Actor3DInterface } from './actor3d-interface'
import { Actor3DProps } from './actor3d-props'

export function Actor3D(props: Actor3DProps): any {
  Logger.trace('aki EVAALUATE Actor3D')
  return function <T extends { new (...args: any[]): Actor3DInterface }>(constructor: T & Actor3DInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements Actor3DInterface {
      // compositions: Map<string, () => any>

      onLoaded?(): void
      onSpawn?(): void

      useComposition<C = any>(id: string): C {
        Logger.trace('aki Actor3D useComposition A', this)
        Logger.trace('aki Actor3D useComposition B', id)
        Logger.trace('aki Actor3D useComposition C', this.compositions)
        Logger.trace('aki Actor3D useComposition D', ActorCompositionsController.get(this, id))
        // if (!this.compositions.get(id)) { Logger.debugError(`Actor3D - Actor composition not found: ${id}`, this) }
        return this.compositions.get(id)()
      }
    }
    const _classCore = class implements Actor3DCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: Actor3DInterface = new _classInterface()
      loaded = false

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        invokeCallback(this.Instance.onLoaded, this.Instance)
        // SpritesController.load(this.props.sprites, scene)
        // 8a8f Load  the rest of props
        return progress
      }

      unload(): void {

      }

      compose() {
        return []
      }

      spawn(): ActorInterface {
        const actor = new _classInterface()
        invokeCallback(actor.onSpawn, actor)
        return actor
      }
    }
    // Logger.trace('aki Actor3DDecorator WTF A', _classInterface)
    // Logger.trace('aki Actor3DDecorator WTF B', new _classInterface().test())
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
