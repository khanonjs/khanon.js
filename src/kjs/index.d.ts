/**
The MIT License

Copyright © 2025 Lorenzo Portillo Samaniego

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Observer } from '@babylonjs/core/Misc/observable'

import { LoadingProgress } from '../base/loading-progress'
import { AppInterface } from '../decorators/app'
import { AppStateConstructor } from '../decorators/app/app-state'
import { SceneConstructor } from '../decorators/scene'
import { SceneStateConstructor } from '../decorators/scene/scene-state'
import { SoundConstructor } from '../decorators/sound'
import {
  Rect,
  Timeout as _Timeout
} from '../models'
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
   * Notification handler.
   */
  export namespace Notify {
    /**
     * Sends a notification.
     * @param id Notification Id.
     * @param receivers Constructor type of the elements that will receive the notification.
     * @param args Method arguments received by the 'Notification' decorated method.
     */
    function send(id: FlexId, receivers?: NotificableType | NotificableType[], ...args: any[]): void
  }

  /**
   * Sounds controller.
   */
  export namespace Sound {
    /**
     * Plays a sound.
     * @param sound Sound constructor.
     */
    function play(sound: SoundConstructor): void

    /**
     * Stop a sound.
     * @param sound Sound constructor.
     */
    function stop(sound: SoundConstructor): void

    /**
     * Sets the global volume.
     * @param value Volume value.
     */
    function setVolume(value: number): void
  }

  export namespace Arrays {
    /**
     * Shuffles an array
     * @param arr
     * @param startsOn
     */
    function shuffle(arr: any[], startsOn?: number): void

    /**
     * Clears an array
     * @param arr
     */
    function clear(arr: any[]): void

    /**
     * Removes a value from an array
     * @param arr
     * @param value
     */
    function removeValue(arr: any[] | undefined, value: any): void

    /**
     * Removes duplicities from two arrays
     * @param arr1
     * @param arr2
     */
    function removeDuplicities(arr1: any[], arr2: any[]): any[]
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
    function dragPoint(ratio: number, origin: Vector3, target: Vector3, ratioClampMin?: number, ratioClampMax?: number): Vector3
    function vectorialProjectionToLine(vector: Vector3, line: Vector3): Vector3
    function scalarProjectionToLine(vector: Vector3, line: Vector3): number
    function vectorialProjectionToPlane(vector: Vector3, planeNormal: Vector3): Vector3
    function scalarProjectionToPlane(vector: Vector3, line: Vector3): number
    function angleBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleXBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleYBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleZBetweenLines(lineA: Vector3, lineB: Vector3): number
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
  export function switchAppState<S extends AppStateConstructor>(state: S, setup: InstanceType<S>['setup']): LoadingProgress // IMPROVE is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Subsscribes to loopUpdate observable.
   * @param func
   */
  export function loopUpdateAddObserver(func: (delta: number) => void): Observer<number>

  /**
   * Removes a subscription from loopUpdate observable.
   */
  export function loopUpdateRemoveObserver(observer: Observer<number>): void

  /**
   * Subsscribes to canvasResize observable.
   * @param func
   */
  export function canvasResizeAddObserver(func: (size: Rect) => void): Observer<Rect>

  /**
   * Removes a subscription from canvasResize observable.
   */
  export function canvasResizeRemoveObserver(observer: Observer<Rect>): void

  /**
   * Returns the canvas rect.
   */
  export function getCanvasRect(): Rect
}
