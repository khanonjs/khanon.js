import { ActorCompositionDefinition } from './actor-composition/actor-composition-definition'
import { ActorMetadata } from './actor-metadata'

export abstract class ActorInterface {
  /**
   * Private
   */
  abstract metadata?: ActorMetadata

  /**
   * Public
  */
  abstract composition?: ActorCompositionDefinition
  abstract setComposition?(id: string): ActorCompositionDefinition

  /**
   * User defined
   */
  abstract onSpawn?(): void
}
