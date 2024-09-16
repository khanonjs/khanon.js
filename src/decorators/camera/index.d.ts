import * as BABYLON from '@babylonjs/core'

import {
  BabylonAccessor,
  Rect
} from '../../models'
import { SceneInterface } from '../scene'

/**
 * @param S Camera setup object.
 */
export declare abstract class CameraInterface<S = any> {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor<ReturnType<this['initialize']>>, 'camera' | 'scene'>

  /**
   * Owner scene.
   */
  get scene(): SceneInterface

  /**
   * Gets teh setup object.
   */
  get setup(): S

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Initialize the camera. This method must return a valid Babylon camera.
   * It will be used from any SceneState requiring it, or from any scene using 'setCamera' method.
   * Setup object isn't availaable at this point.
   */
  abstract initialize(scene: BABYLON.Scene): BABYLON.Camera

  /**
   * Callback invoked on loop update.
   * Setup object is availaable at this point.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Rect.
   */
  onCanvasResize?(size: Rect): void
}

export type CameraConstructor = new () => CameraInterface

export declare function Camera(): any
