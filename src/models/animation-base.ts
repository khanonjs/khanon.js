import { FlexId } from '../types'
import { AnimationKeyFrame } from './animation-keyframe'

export interface AnimationBase {
  /**
   * Id of the animation.
   */
  id: FlexId

  /**
   * Delay between frames (in milliseconds)
   */
  delay: number;

  /**
   * Indicates if the animation is cyclic.
   */
  loop: boolean;

  /**
   * Frame start of the animation. If undefined, it is equivalent to 0.
   */
  frameStart?: number;

  /**
   * Frame end of the animation. If undefined, it is equivalent to the last frame.
   */
  frameEnd?: number;

  /**
   * Each Key frame emit an event when the frame (or frames) are reached.
   */
  keyFrames?: AnimationKeyFrame[];
}
