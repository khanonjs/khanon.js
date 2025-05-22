import { CameraInterface } from '../'
import {
  BabylonAccessor,
  Rect,
  Timeout
} from '../../../models'
import { FlexId } from '../../../types'
import { SceneInterface } from '../../scene'

/**
 * Defines the state of an actor.
 * @param A Camera owner of hte state (optional).
 * @param S Setup interface (optional).
 */
export declare abstract class CameraStateInterface</* Setup object */ S = any, /* Camera type */ D = CameraInterface, /* Scene type */ C = SceneInterface> {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene'>

  /**
   * Setup of the state.
   */
  get setup(): S

  /**
   * Scene owner of the state.
   */
  get scene(): C

  /**
   * Camera owner of the state.
   */
  get camera(): D

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Sets a timeout.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setTimeout(func: () => void, ms: number): Timeout

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
   * Starts a state.
   * @param state
   */
  switchState<C extends new () => CameraStateInterface>(state: C, setup: InstanceType<C>['setup']): CameraStateInterface // IMPROVE is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Notifies a message to this state.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Invoked on state start. Use this method to setup the actor according to the state start.
   */
  onStart?(): void

  /**
   * Invoked on state end. Use this method to setup the actor according to the state end.
   */
  onEnd?(): void

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

export type CameraStateConstructor = new () => CameraStateInterface

export declare function CameraState(): any
