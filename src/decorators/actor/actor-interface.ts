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
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorMetadata } from './actor-metadata'

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> {
  /**
   * Private
   */
  protected abstract metadata?: ActorMetadata

  // 8a8f
  compositions: string

  /**
   * Public
   */
  abstract transform: B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract body: B
  abstract useComposition(id: string): void
  abstract setBody(Node: B extends SpriteInterface ? SpriteConstructor : MeshConstructor): B
  abstract addNode(Node: B extends SpriteInterface ? SpriteConstructor : MeshConstructor, name?: string): B

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void
}
