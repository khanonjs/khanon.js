export interface ActionProps<O> {
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
   * NOTE: Overrides don't apply to method decorators.
   */
  overrides?: O[]
}
