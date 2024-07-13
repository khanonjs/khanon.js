import { Observable } from '@babylonjs/core'

export interface AnimationKeyFrame {
  /**
   * Id of the keyframe.
   */
  id: string | number

  /**
   * Frames to trigger the emitter.
   */
  frames: number[]

  /**
   * Observable emitter.
   */
  emitter: Observable<void>

  /**
   * Milliseconds to trigger it
   */
  ms: number[]
}
