import { DisplayObject } from '../../base/classes/display-object'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { ActorCompositionBuilder } from './actor-composition/actor-composition-builder'
import { ActorMetadata } from './actor-metadata'

export abstract class ActorInterface {
  /**
   * Private
   */
  abstract metadata?: ActorMetadata
  abstract body?: DisplayObject

  /**
   * Public
  */
  abstract transform?: SpriteTransform | MeshTransform
  abstract composition?: ActorCompositionBuilder
  abstract useComposition?(id: string, CompositionDefinition?: new (id: string) => ActorCompositionBuilder): ActorCompositionBuilder

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void
}
