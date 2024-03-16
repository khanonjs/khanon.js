import { throwError } from 'rxjs'

import { Observable } from '@babylonjs/core'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneConstructor,
  StateConstructor
} from './constructors'
import { AppProps } from './decorators/app/app-props'
import { SceneProps } from './decorators/scene/scene-props'
import { LoadingProgress } from './models'

// App decorator
export declare function App(props: AppProps): any
export { AppProps } from './decorators/app/app-props'
export { AppInterface } from './decorators/app/app-interface'

// Scene decorator
export declare function Scene(props: SceneProps): any
export { SceneProps } from './decorators/scene/scene-props'
export { SceneInterface } from './decorators/scene/scene-interface'

declare interface _KJS {
  throw: () => void
  hola(): void
}

// Khanonjs global controller
export declare namespace KJS {
  /**
   * Throws critical error and stops the application.
   * @param error
   */
  function throw_(error?: any): void

  /**
   * Clears cache.
   */
  function clearCache(): void

  /**
   * Scene controller
   */
  export namespace Scene {
    function load(scene: SceneConstructor): LoadingProgress
    function load(scene: SceneConstructor[]): LoadingProgress
    function unload(): void
    function start(): void
    function stop(): void
  }
}

// Modules
export { Logger } from './modules/logger/logger'
export { LoggerLevels } from './modules/logger/logger-levels'

/* export { Scene } from './decorators/scene/scene-decorator'
export { SceneInterface } from './decorators/scene/scene-interface'
// export { SceneConfiguration } from './decorators/scene/scene-configuration'

declare enum ETransitionEffect {
  FADE
}

interface TransitionEffect {
  effect: ETransitionEffect
  factor: number
} */

/* export declare namespace KJS {
  export type SceneInterface = string

  export function clearCache(): void

  export namespace Scene { // ControllerScene class
    function load(scene: SceneConstructor): Observable<LoadingProgress>
    function unload(scene: SceneConstructor): void
    function start(scene: SceneConstructor, effect: TransitionEffect): void
    function stop(scene: SceneConstructor, effect: TransitionEffect): void
  }

  export namespace GUI { // ControllerGUI class
    function load(gui: GUIConstructor): Observable<LoadingProgress>
    function unload(gui: GUIConstructor): void
    function show(gui: GUIConstructor): void
    function hide(gui: GUIConstructor): void
  }
} */
