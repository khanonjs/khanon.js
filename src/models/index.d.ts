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
   * Indicates if the animation is cyclic, 'false' by default.
   * This property is omitted in particles.
   */
  loop?: boolean

  /**
   * Each Key frame emit an event when the frame/s are reached.
   */
  keyFrames?: AnimationKeyFrame[]
}

export { BabylonAccessor } from './babylon-accessor'
export { DrawBlockProperties } from './draw-block-properties'
export { Rect } from './rect'
export declare interface Timeout {}
export { TransformComposition } from './transform-composition'
