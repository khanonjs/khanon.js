export interface SpriteAnimationOptions {
  /**
   * Defines if animations must loop.
   */
  loop?: boolean

  /**
   * By default *false*.
   *
   * If *false*, the animation won't restart in case the same animation is playing.
   * If *true*, the animation restarts from the beggining in case the same animation is playing.
   */
  restart?: boolean
}
