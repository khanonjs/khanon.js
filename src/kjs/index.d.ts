import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../base'
import { AppInterface } from '../decorators/app'
import { AppStateConstructor } from '../decorators/app/app-state'
import { SceneConstructor } from '../decorators/scene'
import { SceneStateConstructor } from '../decorators/scene/scene-state'
import { SoundConstructor } from '../decorators/sound'
import { Timeout as _Timeout } from '../models'
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
   * Types
   */
  export type Timeout = _Timeout

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
   * @param id Message Id.
   * @param receivers Constructor type of the elements that will receive the notification.
   * @param args Method arguments received by the 'Notification' decorated method.
   */
  export namespace Notify {
    function send(id: FlexId, receivers?: NotificableType | NotificableType[], ...args: any[]): void
  }

  /**
   * Sounds controller.
   */
  export namespace Sound {
    function play(id: SoundConstructor): void
    function stop(id: SoundConstructor): void
    function setVolume(value: number): void
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
}
