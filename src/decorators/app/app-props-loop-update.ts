export interface AppPropLoopUpdate {
  /**
   * Application frames per second.
   * Number of times per second loop update will invoke all logical methods.
   * Loop update methods are defined in any actor/scene/particle class interface.
   * It is possible as well to Subscribe to the loop update Subject trough an BABYLON.Observer.
   * Default value = 30 fps.
   */
  fps?: number
}
