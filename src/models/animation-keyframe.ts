import { Observable } from '@babylonjs/core'

export class AnimationKeyFrame {
  /**
   * Name of the keyframe.
   */
  name: string

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
