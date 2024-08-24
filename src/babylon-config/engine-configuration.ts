import * as BABYLON from '@babylonjs/core'

export type EngineConfiguration = {
  /**
   * Default = false
   */
  antialias?: boolean

  /**
   * Babylon engine options
   */
  options?: BABYLON.EngineOptions

  /**
   * Default = true
   */
  adaptToDeviceRatio?: boolean
}
