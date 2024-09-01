import * as BABYLON from '@babylonjs/core'

export type EngineConfiguration = {
  /**
   * Default = false
   */
  antialias?: boolean

  /**
   * Refers to Babylon engine options: https://doc.babylonjs.com/typedoc/interfaces/BABYLON.EngineOptions
   */
  options?: BABYLON.EngineOptions

  /**
   * Default = true
   */
  adaptToDeviceRatio?: boolean
}
