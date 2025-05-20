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

  export namespace Arrays {
    function shuffle(arr: any[], startsOn?: number): void
    function clear(arr: any[]): void
  }

  export namespace Maths {
    const MIN_VALUE: number
    function dragValue(ratio: number, origin: number, target: number, ratioClampMin?: number, ratioClampMax?: number): number
    function clamp(value: number, min: number, max: number): number
    function randomInt(minValue: number, maxValue: number): number
    function increaseValue(from: number, to: number, speed: number, completed?: () => void): number
    function increaseValueWithInertia(from: number, to: number, speed: number, acceleration?: number, completed?: () => void): number
    function increaseVector(from: number[], to: number[], speed: number, completed?: () => void): number[]
    function increaseVectorWithInertia(from: number[], to: number[], speed: number, acceleration?: number, completed?: () => void): number[]
  }

  export namespace Vectors {
    function dragPoint(ratio: number, origin: BABYLON.Vector3, target: BABYLON.Vector3, ratioClampMin?: number, ratioClampMax?: number): BABYLON.Vector3
    function vectorialProjectionToLine(vector: BABYLON.Vector3, line: BABYLON.Vector3): BABYLON.Vector3
    function scalarProjectionToLine(vector: BABYLON.Vector3, line: BABYLON.Vector3): number
    function vectorialProjectionToPlane(vector: BABYLON.Vector3, planeNormal: BABYLON.Vector3): BABYLON.Vector3
    function scalarProjectionToPlane(vector: BABYLON.Vector3, line: BABYLON.Vector3): number
    function angleBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
    function angleXBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
    function angleYBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
    function angleZBetweenLines(lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number
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
