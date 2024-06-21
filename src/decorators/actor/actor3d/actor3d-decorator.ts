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
import { ActorCompositionDefinition } from '../actor-composition/actor-composition-definition'
import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata'
import { Actor3DCore } from './actor3d-core'
import { Actor3DInterface } from './actor3d-interface'
import { Actor3DProps } from './actor3d-props'

export function Actor3D(props: Actor3DProps): any {
  Logger.trace('aki EVALUATE Actor3D')
  return function <T extends { new (...args: any[]): Actor3DInterface }>(constructor: T & Actor3DInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements Actor3DInterface {
      metadata: ActorMetadata = Reflect.getMetadata('metadata', this)
      composition: ActorCompositionDefinition

      constructor(private readonly scene: SceneType) {
        super()
      }

      onSpawn?(): void

      setComposition(id: string): ActorCompositionDefinition {
        if (!this.metadata.compositions.get(id)) { Logger.debugError(`Actor3D - Actor composition not found: ${id}`, this) }
        if (this.composition) {
          this.composition.release()
        }
        this.composition = new ActorCompositionDefinition(id)
        this.metadata.compositions.get(id)(new ActorCompositionDefinition(id), this.scene)
        return this.composition
      }
    }
    const _classCore = class implements Actor3DCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: Actor3DInterface = new _classInterface(null)
      loaded = false

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        // SpritesController.load(this.props.sprites, scene)
        // 8a8f Load  the rest of props
        return progress
      }

      unload(): void {

      }

      compose() {
        return []
      }

      spawn(scene: SceneType): ActorInterface {
        const actor = new _classInterface(scene)
        invokeCallback(actor.onSpawn, actor)
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
