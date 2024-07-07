import {
  Camera as BabylonCamera,
  SceneasBabylonScene
} from '@babylonjs/core/scene'

import {
  BabylonAccessor,
  Rect
} from '../../models'

export declare function Camera(): any
export declare abstract class CameraInterface {
  get babylon(): Pick<BabylonAccessor<ReturnType<this['initialize']>>, 'camera'>

  /**
   * Turns ON/OFF 'onLoopUpdate' callback
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Initialize the camera. This method must return a valid Babylon camera.
   * It will be used from any Scene State requiring it.
   */
  abstract initialize(scene: SceneasBabylonScene): BabylonCamera

  /**
   * Callback invoked on loop update.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Rect.
   */
  onCanvasResize?(size: Rect): void
}
