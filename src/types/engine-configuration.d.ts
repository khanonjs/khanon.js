import { EngineOptions } from '@babylonjs/core/Engines/thinEngine'
import { WebGPUEngineOptions } from '@babylonjs/core/Engines/webgpuEngine'

import { EngineMode } from './engine-mode'

export type EngineConfiguration = {
  /**
   * Default = false. Not used in WebGPU mode.
   */
  antialias?: boolean

  /**
   * Default = true. Not used in WebGPU mode.
   */
  adaptToDeviceRatio?: boolean

  /**
   * Refers to:
   * - Options WebGL:  https://doc.babylonjs.com/typedoc/interfaces/BABYLON.EngineOptions
   * - Options WebGPU: https://doc.babylonjs.com/typedoc/interfaces/BABYLON.WebGPUEngineOptions
   */
  options?: EngineOptions | WebGPUEngineOptions

  /**
   * Engine mode (WebGPU / WebGL). Default = WebGL.
   */
  mode?: EngineMode
}
