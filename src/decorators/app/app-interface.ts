export declare interface AppInterface {
  /**
   * Entry point of the application.
   * Called after the application has been properly configured and started.
   * At this point, the first scene and/or GUI should be started.
   */
  onStart(): void

  /**
   * Called on browser tab closed (Optional).
   * Release any app resource.
   * The application progress should be saved at this point.
   */
  onClose?(): void

  /**
   * Called on any app error.
   * App errors are critical and the application is closed at this point.
   */
  onError?(error?: any): void
}
