import { ActionInterface } from '../../../base'
import { ActorInterface } from '../actor-interface'
import { ActorActionProps } from './actor-action-props'

export abstract class ActorActionInterface<S = any> extends ActionInterface<S> {
  abstract props?: ActorActionProps

  /**
   * User available
   */
  abstract actor: ActorInterface<any>
}
