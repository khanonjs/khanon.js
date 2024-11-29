import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import {
  EngineConfiguration,
  FlexId
} from '../../types'
import { AppPropLoopUpdate } from './app-props-loop-update'
import {
  AppStateConstructor,
  AppStateInterface
} from './app-state'

export declare abstract class AppInterface {
  /**
   * Gets the current state.
   */
  get state(): AppStateInterface

  /**
   * Starts a new state.
   * @param state
   * @param setup
   */
  switchState<S extends AppStateConstructor>(state: S, setup: InstanceType<S>['setup']): LoadingProgress // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Notifies a message to the App.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Entry point of the application.
   * Called after the application has been properly configured and started.
   * At this point, the first scene and/or GUI should be started.
   */
  abstract onStart(): void

  /**
   * Callback invoked on app error. This error could happen at any point of the app's lifetime and it is critical, it will stop the application.
   * Otherwise the error would be shown in the browser console.
   */
  onError?(error?: any): void

  /**
   * Called on browser tab closed.
   * Release any app resource.
   * The application progress should be saved at this point.
   */
  onClose?(): void
}

export type AppConstructor = new () => AppInterface

export { AppPropLoopUpdate } from './app-props-loop-update'

export interface AppProps {
  /**
   * Name of the application.
   */
  name: string

  /**
   * HTML div element 'id' where Khanon.js will create the canvas for Babylon.js.
   * Default value is 'khanonjs'.
   */
  htmlCanvasContainerId?: string

  /**
   * Loop update properties.
   * Loop update is the main loop application.
   * Any scene, actor, particle, or whatever logical methods are invoked from this Subject a number of frames per second.
   */
  loopUpdate?: AppPropLoopUpdate

  /**
   * Babylon.js engine configuration
   */
  engineConfiguration?: EngineConfiguration

  /**
   * If 'true', all intervals and timeouts created trought KJS.setTimeout or KJS.setInterval are removed.
   * This helps to keep the consistency of the app, avoiding to perform actions after an app state scene is removed.
   * Use it ONLY if you are setting timeouts and intervals within scene elements.
   */
  removeTimeoutsOnStateSwitch?: boolean

  /**
   * Logs Khanon.js debug information.
   * This feature is only present in development mode (NODE_ENV = 'development').
   */
  debugLog?: boolean
}

export declare function App(props: AppProps): any
