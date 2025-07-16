import { FlexId } from '../types/flex-id'
import { AnimationKeyFrame } from './animation-keyframe'

export declare interface AnimationBase {
  /**
   * Id of the animation.
   */
  id: FlexId

  /**
   * Indicates if the animation is cyclic, *false* by default.
   * This property is omitted in particles.
   */
  loop?: boolean

  /**
   * Each Key frame emit an event when the frame/s are reached.
   */
  keyFrames?: AnimationKeyFrame[]
}
