import { FlexId } from '../types'

export declare interface AnimationKeyFrame {
  /**
   * Id of the keyframe.
   */
  id: FlexId

  /**
   * Frames to trigger the emitter.
   */
  frames: number[]
}

export declare interface AnimationBase {
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

export { BabylonAccessor } from './babylon-accessor'
export { DrawBlockProperties } from './draaw-text-properties'
export { Rect } from './rect'
export declare class Timeout {}
