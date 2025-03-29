/**
 * These options are related to babylon AnimationGroup start options:
 * https://doc.babylonjs.com/typedoc/classes/BABYLON.AnimationGroup#start
 */
export interface MeshAnimationOptions {
  /**
   * Defines if animations must loop.
   */
  loop?: boolean,

  /**
   * Defines the ratio to apply to animation speed (1 by default).
   */
  speedRatio?: number,

  /**
   * Defines the from key (optional).
   */
  from?: number,

  /**
   * Defines the to key (optional).
   */
  to?: number,

  /**
   * Defines the additive state for the resulting animatables (optional).
   */
  isAdditive?: boolean

  /**
   * By default *false*.
   *
   * If *false*, the animation won't restart in case the same animation is playing.
   * If *true*, the animation restarts from the beggining in case the same animation is playing.
   */
  restart?: boolean
}
