import * as BABYLON from '@babylonjs/core'

import {
  BabylonAccessor,
  Rect
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
   * Gets teh setup object.
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

export declare function Camera(props: CameraProps = {}): any
