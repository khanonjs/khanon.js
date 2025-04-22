export interface AppPropsAudioEngine {
  /**
   * Set to `true` to disable the default UI. Defaults to `true`.
   */
  disableDefaultUI?: boolean;
  /**
   * Set to `true` to automatically resume the audio context when the user interacts with the page. Defaults to `true`.
   */
  resumeOnInteraction?: boolean;
  /**
   * Set to `true` to automatically resume the audio context when the browser pauses audio playback. Defaults to `true`.
   */
  resumeOnPause?: boolean;
  /**
   * The interval in milliseconds to try resuming audio playback when `resumeOnPause` is `true`. Defaults to `1000`.
   */
  resumeOnPauseRetryInterval?: number;
}
