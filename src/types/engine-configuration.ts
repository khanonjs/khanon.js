import { EngineOptions } from '@babylonjs/core/Engines/thinEngine'

export type EngineConfiguration = {
  /**
   * Default = false
   */
  antialias?: boolean

  /**
   * Refers to Babylon engine options: https://doc.babylonjs.com/typedoc/interfaces/BABYLON.EngineOptions
   */
  options?: EngineOptions

  /**
   * Default = true
   */
  adaptToDeviceRatio?: boolean
}
