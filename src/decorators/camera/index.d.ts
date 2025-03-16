import * as BABYLON from '@babylonjs/core'

import {
  BabylonAccessor,
  Rect,
  Timeout
} from '../../models'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene'

/**
 * @param S Camera setup object.
 */
export declare abstract class CameraInterface</* Setup object */ S = any, /* Scene object */ C = SceneInterface> {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor<ReturnType<this['onInitialize']>>, 'camera' | 'scene'>

  /**
   * Owner scene.
   */
  get scene(): C

  /**
   * Gets the setup object.
   */
  get setup(): S

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Returns the name of the class.
   */
  getClassName(): string

  /**
   * Sets a timeout.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setTimeout(func: () => void, ms: number, context?: any): Timeout

  /**
   * Sets an interval.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setInterval(func: () => void, ms: number): Timeout

  /**
   * Clears a timeout in this context.
   * @param timeout
   */
  clearTimeout(timeout: Timeout): void

  /**
   * Clears an interval in this context.
   * @param timeout
   */
  clearInterval(timeout: Timeout): void

  /**
   * Clear all timeouts and intervals in this context.
   */
  clearAllTimeouts(): void

  /**
   * Notifies a message to this camera.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Callback you need to implement to initialize the camera.
   * This method must return a valid Babylon camera.
   * 'setup' object isn't available at this point.
   */
  abstract onInitialize(scene: BABYLON.Scene): BABYLON.Camera

  /**
   * Callback invoked on camera start.
   * Use this callback to setup the camera, the 'setup' object is available here.
   */
  onStart?(): void

  /**
   * Callback invoked on camera stop.
   */
  onStop?(): void

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

export interface CameraProps {}

export declare function Camera(props?: CameraProps): any
