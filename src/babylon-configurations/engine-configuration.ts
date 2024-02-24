import { EngineOptions as BabylonEngineOptions } from '@babylonjs/core'

export type EngineConfiguration = {
  /**
   * Default = false
   */
  antialias?: boolean

  /**
   * Babylon engine options
   */
  options?: BabylonEngineOptions

  /**
   * Default = true
   */
  adaptToDeviceRatio?: boolean
}

