import { ActorActionConstructor } from '../../../constructors/actor-action-constructor'

export interface ActorActionProps {
  /**
   * All actions of a group can be stopped from 'actor.stopActionGroup'.
   */
  group?: number

  /**
   * 'false' by default. Preserves the action, not removing it after stop.
   */
  preserve?: boolean

  /**
   * List of actions to be overriden on action play.
   */
  overrides?: ActorActionConstructor[]
}
