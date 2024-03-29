import { EngineConfiguration } from '../../babylon-config'
import { AppPropLoopUpdate } from './app-props-loop-update'

export interface AppProps {
  /**
   * Name of the application.
   */
  name: string

  /**
   * HTML div element 'id' where Khanon.js will render the application.
   * Default value: 'khanonjs'
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
   * Logs Khanon.js debug information.
   * This feature is only present in development mode (NODE_ENV = 'development').
   */
  debugLog?: boolean

  /**
   * Logs canvas size in case it has been resized
   */
  logCanvasSize?: boolean
}
