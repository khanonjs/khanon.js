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
   * Animation speed ratio (1 by default).
   */
  speedRatio?: number,

  /**
   * From key (optional).
   */
  from?: number,

  /**
   * To key (optional).
   */
  to?: number,

  /**
   * Additive state for the resulting animatables (optional).
   */
  isAdditive?: boolean

  /**
   * By default *false*.
   * If *false*, the animation won't restart in case the same animation is playing.
   * If *true*, the animation restarts from the beggining in case the same animation is playing.
   */
  restart?: boolean
}
