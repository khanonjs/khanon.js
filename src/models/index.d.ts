import * as BABYLON from '@babylonjs/core'

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
   * Frame start of the animation, '0' by default.
   */
  frameStart?: number

  /**
   * Frame end of the animation. It is equivalent to the last frame by default.
   */
  frameEnd?: number

  /**
   * Delay between frames (in milliseconds), '100' by default.
   * This property is omitted in particles.
   */
  delay?: number

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

export class BabylonAccessor<C extends BABYLON.Camera = any> {
  get camera(): C
  get engine(): BABYLON.Engine
  get scene(): BABYLON.Scene
  get sprite(): BABYLON.Sprite
  get mesh(): BABYLON.Mesh
  get spriteManager(): BABYLON.SpriteManager
  get particleSystem(): BABYLON.ParticleSystem
}

export { AssetType } from './asset-type'
export { DrawBlockProperties } from './draw-text-properties'
export { Rect } from './rect'
export declare class Timeout {}
