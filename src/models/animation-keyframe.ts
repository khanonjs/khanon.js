import { Observable } from '@babylonjs/core'

export class AnimationKeyFrame {
  /**
   * Id of the keyframes group
   */
  id: number

  /**
   * Frames numbers
   */
  frames: number[]

  /**
   * Subject linked to this keyframe.
   * Since can be more keyframes of this ID, all of them are linked to the same Subject.
   * This is handled by Actor module.
   */
  linkedSubject?: Observable<void>

  /**
   * Timeouts to emit subject on animation start
   * This is handled by Actor module.
   */
  timeouts?: number[]
}
