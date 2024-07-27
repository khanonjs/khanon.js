import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from './base'
import { SceneConstructor } from './constructors/scene-constructor'
import { SceneStateConstructor } from './constructors/scene-state-constructor'
import { Timeout } from './models'
import { Rect } from './models/rect'
import { FlexId } from './types/flex-id'
import { NotificableType } from './types/notificable-type'

// **************
//  Models
// **************
export { Rect } from './models/rect'
export { UseCamera } from './models/use-camera'

// **************
//  Constructors
// **************
export { ActorConstructor } from './constructors/actor-constructor'
export { ActorActionConstructor } from './constructors/actor-action-constructor'
export { ActorStateConstructor } from './constructors/actor-state-constructor'
export { AppConstructor } from './constructors/app-constructor'
export { CameraConstructor } from './constructors/camera-constructor'
export { GUIConstructor } from './constructors/gui-constructor'
export { MeshConstructor } from './constructors/mesh-constructor'
export { MeshMapConstructor } from './constructors/mesh-map-constructor'
export { MotionConstructor } from './constructors/motion-constructor'
export { ParticleConstructor } from './constructors/particle-constructor'
export { ParticleSourceConstructor } from './constructors/particle-source-constructor'
export { SceneConstructor } from './constructors/scene-constructor'
export { SceneStateConstructor } from './constructors/scene-state-constructor'
export { TileMapConstructor } from './constructors/tile-map-constructor'
export { SceneMapConstructor } from './constructors/scene-map-constructor'
export { SpriteConstructor } from './constructors/sprite-constructor'

// ****************
// KJS App handler
// ****************
export declare namespace KJS {
  /**
   * Scene controller
   */
  export namespace Scene {
    function load(scene: SceneConstructor): LoadingProgress
    function load(scene: SceneConstructor[]): LoadingProgress
    function unload(scene: SceneConstructor): void
    function unload(scene: SceneConstructor[]): void
    function start<S extends SceneStateConstructor>(scene: SceneConstructor, state: S, stateSetup: InstanceType<S>['setup']): void
    function stop(scene: SceneConstructor): void
  }

  export namespace Notify {
    function send(message: FlexId, elements: NotificableType): void
  }

  /**
   * Throws critical error and stops the application.
   * @param error
   */
  function throw_(error?: any): void;
  export { throw_ as throw } // Hack function name :)

  /**
   * Clears cache.
   */
  export function clearCache(): void

  /**
   * Subsscribes to loopUpdate event.
   * @param func
   */
  export function loopUpdateAddObserver(func: (delta: number) => void): BABYLON.Observer<number>

  /**
   * Removes a subscription from loopUpdate event.
   */
  export function loopUpdateRemoveObserver(observer: BABYLON.Observer<number>): void

  /**
   * Returns the canvas rect.
   */
  export function getCanvasRect(): Rect

  /**
   * Sets a timeout.
   * This timeout relies on the app loopUpdate, meaning the application will trigger it at time, no matter if the tab is unfocused.
   * Some browsers delay native timeouts when tab is unfocused to unweight cpu load, what could drive to app inconsistencies.
   * @param func Callback
   * @param ms Milliseconds
   * @param context
   */
  export function setTimeout(func: () => void, ms: number, context?: any): Timeout

  /**
   * Sets an interval.
   * This interval relies on the app loopUpdate, meaning the application will trigger it at time, no matter if the tab is unfocused.
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
}

export * from './models'

export * from './modules/helper'
export * from './modules/logger'

export * from './decorators/app'
export * from './decorators/actor'
export * from './decorators/actor/actor-action'
export * from './decorators/actor/actor-state'
export * from './decorators/camera'
export * from './decorators/mesh'
export * from './decorators/notification'
export * from './decorators/sprite'
export * from './decorators/scene'
export * from './decorators/scene/scene-action'
export * from './decorators/scene/scene-state'
