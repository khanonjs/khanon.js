import { Observable } from '@babylonjs/core'

/*import { LoadingProgress } from './_OLD-models/loading-progress'
import { GUIConstructor } from './decorators/gui/gui-constructor'
import { SceneConstructor } from './decorators/scene/scene-constructor'*/
import { AppProps } from '../../lorenzo.portillo-website/rkhanonjs/decorators/app/app-props'
import { LoadingProgress } from '../qkhanonjsold/_OLD-models/loading-progress'
import { SceneController } from './controllers/scene-controller'

// export * from './_OLD-models'
// export * from './modules'

// export { Core } from './core'

// ****** NEW DECORATOR BASED ENGINE ***********

// App decorator
export declare function App(props: AppProps): any
export { AppInterface } from './decorators/app/app-interface'

// Khanonjs global controller
export declare class KJS {
  /**
   * Throws critical error and stops the application.
   * @param error
   */
  static throw(error?: any): void

  /**
   * Scene controller
   */
  static get Scene(): {
    start(): void
    stop(): void
    load(): LoadingProgress
    unload(): void
  }
}

// Modules
export { Logger } from './modules/logger/logger'
export { LoggerLevels } from './modules/logger/logger-levels'

/*export { Scene } from './decorators/scene/scene-decorator'
export { SceneInterface } from './decorators/scene/scene-interface'
// export { SceneConfiguration } from './decorators/scene/scene-configuration'

declare enum ETransitionEffect {
  FADE
}

interface TransitionEffect {
  effect: ETransitionEffect
  factor: number
}*/

/*export declare namespace KJS {
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
}*/
