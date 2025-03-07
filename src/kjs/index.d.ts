import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../base'
import { AppInterface } from '../decorators/app'
import {
  AppStateConstructor,
  AppStateInterface
} from '../decorators/app/app-state'
import { SceneConstructor } from '../decorators/scene'
import { SceneStateConstructor } from '../decorators/scene/scene-state'
import { Timeout } from '../models'
import { Rect } from '../models/rect'
import {
  FlexId,
  NotificableType
} from '../types'

// ******************
//  KJS App handler
// ******************
export declare namespace KJS {
  /**
   * Scene controller.
   */
  export namespace Scene {
    function load(scene: SceneConstructor): LoadingProgress
    function load(scene: SceneConstructor[]): LoadingProgress
    function unload(scene: SceneConstructor): void
    function unload(scene: SceneConstructor[]): void
    function start<S extends SceneStateConstructor>(scene: SceneConstructor, state?: S, stateSetup?: InstanceType<S>['setup']): void
    function stop(scene: SceneConstructor): void
    function setState<S extends SceneStateConstructor>(scene: SceneConstructor, state: S, stateSetup: InstanceType<S>['setup']): void
  }

  /**
   * Notification controller.
   * @param message Message Id.
   * @param receivers Constructor type of the elements that will receive the notification.
   * @param args Method arguments received by the 'Notification' decorated method.
   */
  export namespace Notify {
    function send(message: FlexId, receivers?: NotificableType | NotificableType[], ...args: any[]): void
  }

  /**
   * Throws critical error and stops the application.
   * @param error
   */
  function throw_(error?: any): void;
  export { throw_ as throw } // Hack function name :)

  /**
   * Returns the app instance.
   */
  export function getApp<A extends AppInterface>(): A

  /**
   * Sets the app state.
   */
  export function switchAppState<S extends AppStateConstructor>(state: S, setup: InstanceType<S>['setup']): LoadingProgress // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Clears cache.
   */
  export function clearCache(): void

  /**
   * Subsscribes to loopUpdate observable.
   * @param func
   */
  export function loopUpdateAddObserver(func: (delta: number) => void): BABYLON.Observer<number>

  /**
   * Removes a subscription from loopUpdate observable.
   */
  export function loopUpdateRemoveObserver(observer: BABYLON.Observer<number>): void

  /**
   * Subsscribes to canvasResize observable.
   * @param func
   */
  export function canvasResizeAddObserver(func: (size: Rect) => void): BABYLON.Observer<Rect>

  /**
   * Removes a subscription from canvasResize observable.
   */
  export function canvasResizeRemoveObserver(observer: BABYLON.Observer<Rect>): void

  /**
   * Returns the canvas rect.
   */
  export function getCanvasRect(): Rect

  /**
   * Sets a timeout.
   * This timeout relies on the app loopUpdate, meaning the application will trigger it at time, no matter if the browser tab is unfocused.
   * Some browsers delay native timeouts when tab is unfocused to unweight cpu load, what could drive to app inconsistencies.
   * @param func Callback
   * @param ms Milliseconds
   * @param context
   */
  export function setTimeout(func: () => void, ms: number, context?: any): Timeout

  /**
   * Sets an interval.
   * This interval relies on the app loopUpdate, meaning the application will trigger it at time, no matter if the browser tab is unfocused.
   * Some browsers delay native timeouts when tab is unfocused to unweight cpu load, what could drive to app inconsistencies.
   * @param func Callback
   * @param ms Milliseconds
   * @param context
   */
  export function setInterval(func: () => void, ms: number, context?: any): Timeout

  /**
   * Clears a timeout.
   * @param timeout
   */
  export function clearTimeout(timeout: Timeout): void

  /**
   * Clears an interval.
   * @param timeout
   */
  export function clearInterval(timeout: Timeout): void

  /**
   * Clear all timeouts and intervals.
   */
  export function clearAllTimeouts(): void
}
