import { StateInterface } from '../../../base'
import { ActorInterface } from '../actor-interface'

export abstract class ActorStateInterface<S = any> extends StateInterface<S> {
  /**
   * User available
   */
  abstract actor: ActorInterface
}
