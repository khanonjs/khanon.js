export interface AppPropsLoopUpdate {
  /**
   * Frames per second the application will run.
   * Number of times per second loop update will invoke all logical methods (commonly 'onLoopUpdate' callbacks in some interfaces).
   * Default value = 30 fps.
   */
  fps?: number
}
