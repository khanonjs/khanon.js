import { LoadingProgress } from '../../base'
import { ActorsController } from '../../controllers'
import {
  invokeCallback,
  removeArrayDuplicitiesInObject
} from '../../helpers/utils'
import { Logger } from '../../modules'
import { SceneType } from '../scene/scene-type'
import { ActorCompositionDefinition } from './actor-composition/actor-composition-definition'
import { ActorCore } from './actor-core'
import { ActorInterface } from './actor-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'

export function Actor(props: ActorProps): any {
  return function <T extends { new (...args: any[]): ActorInterface }>(constructor: T & ActorInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorInterface {
      metadata: ActorMetadata = Reflect.getMetadata('metadata', this)
      composition: ActorCompositionDefinition

      constructor(private readonly scene: SceneType) {
        super()
      }

      onSpawn?(): void

      useComposition(id: string, CompositionDefinition?: new (id: string) => ActorCompositionDefinition): ActorCompositionDefinition {
        if (!this.metadata.compositions.get(id)) { Logger.debugError(`Actor - Actor composition not found: ${id}`, this) }
        if (this.composition) {
          this.composition.release()
        }
        this.composition = CompositionDefinition
          ? new CompositionDefinition(id)
          : new ActorCompositionDefinition(id)
        this.metadata.compositions.get(id)(new ActorCompositionDefinition(id), this.scene)
        return this.composition
      }
    }
    const _classCore = class implements ActorCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: ActorInterface = new _classInterface(null)
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
        invokeCallback(actor.onSpawn, actor, scene)
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
