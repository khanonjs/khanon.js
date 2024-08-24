import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SpriteInterface } from '../../sprite/sprite-interface'
import { ActorInterface } from '../actor-interface'

export abstract class ActorStateInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>> extends StateInterface<S> {
  abstract metadata?: Metadata

  /**
   * User available
   */
  abstract actor: A
}
