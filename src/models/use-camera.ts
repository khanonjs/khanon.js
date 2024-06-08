export enum UseCamera {
  /**
   * Uses the state camera always on start
   */
  ON_START = 'onStart',

  /**
   * Uses any camera already on use.
   * In case no camera is being used, it will use the camera by default for that state.
   */
  INHERIT = 'inherit'
}
