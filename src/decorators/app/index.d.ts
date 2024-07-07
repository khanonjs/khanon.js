// **************
// App decorator

import { AppProps } from './app-props'

// **************
export { AppProps } from './decorators/app/app-props'
export declare function App(props: AppProps): any
export declare abstract class AppInterface {
  /**
   * Entry point of the application.
   * Called after the application has been properly configured and started.
   * At this point, the first scene and/or GUI should be started.
   */
  abstract onStart(): void

  /**
   * Callback invoked on app error. This error could happen at any point of the app lifetime and is critical, it will stop the application.
   */
  abstract onError(error?: any): void

  /**
   * Called on browser tab closed (Optional).
   * Release any app resource.
   * The application progress should be saved at this point.
   */
  onClose?(): void
}
