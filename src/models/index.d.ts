export declare interface AnimationKeyFrame {
  /**
   * Id of the keyframe.
   */
  id: string | number

  /**
   * Frames to trigger the emitter.
   */
  frames: number[]
}

export declare interface AnimationBase {
  /**
   * Id of the animation.
   */
  id: string | number

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

export declare class Timeout {}
