import {
  MeshConstructor,
  SpriteConstructor
} from '../../constructors'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorComposition } from './actor-composition'
import { ActorMetadata } from './actor-metadata'

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> {
  /**
   * Private
   */
  protected abstract metadata?: ActorMetadata
  abstract scene?: SceneType

  /**
   * Public
   */
  abstract transform: B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract composition: ActorComposition<B>

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void
}
