import { StateInterface } from '../../../base'
import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata'

export abstract class ActorStateInterface<S = any> extends StateInterface<S> {
  abstract metadata?: ActorMetadata

  /**
   * User available
   */
  abstract actor: ActorInterface
}
