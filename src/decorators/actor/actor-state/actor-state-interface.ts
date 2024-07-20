import { StateInterface } from '../../../base'
import { MeshInterface } from '../../mesh'
import { SpriteInterface } from '../../sprite'
import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata'

export abstract class ActorStateInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>> extends StateInterface<S> {
  abstract metadata?: ActorMetadata

  /**
   * User available
   */
  abstract actor: A
}
