import * as BABYLON from '@babylonjs/core'

import {
  AnimationBase,
  AnimationKeyFrame,
  BabylonAccessor,
  Rect
} from '../../models'
import { DrawBlockProperties } from '../../models/draw-block-properties'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene'
import { SpriteAnimationOptions } from './sprite-animatrion-options'

export { SpriteAnimationOptions } from './sprite-animatrion-options'

export interface SpriteAnimation extends AnimationBase {
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
   * This property is ignored in particles.
   */
  delay?: number
}

export declare abstract class SpriteInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'mesh' | 'scene'>

  /**
   * Scene owner of this Sprite.
   */
  get scene(): SceneInterface

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Gets the current animation.
   */
  get animation(): SpriteAnimation

  /**
   * Sprite visiiility.
   */
  set visibility(value: number)
  get visibility(): number

  /**
   * Sets or gets the mesh enable state.
   */
  set enabled(value: boolean)
  get enabled(): boolean

  /**
   * Sprite transform properties.
   */
  get absolutePosition(): BABYLON.Vector3
  set position(value: BABYLON.Vector3)
  get position(): BABYLON.Vector3
  getAbsolutePivotPoint(): BABYLON.Vector3
  getAbsolutePivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  getAbsolutePosition(): BABYLON.Vector3
  getPivotPoint(): BABYLON.Vector3
  getPivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  locallyTranslate(vector3: BABYLON.Vector3): BABYLON.TransformNode
  rotateAround(point: BABYLON.Vector3, axis: BABYLON.Vector3, amount: number): BABYLON.TransformNode
  setAbsolutePosition(absolutePosition: BABYLON.Vector3): BABYLON.TransformNode
  setDirection(localAxis: BABYLON.Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): BABYLON.TransformNode
  setPivotMatrix(matrix: BABYLON.DeepImmutable<BABYLON.Matrix>, postMultiplyPivotMatrix?: boolean): BABYLON.TransformNode
  setPivotPoint(point: BABYLON.Vector3, space?: BABYLON.Space): BABYLON.TransformNode
  setPositionWithLocalVector(vector3: BABYLON.Vector3): BABYLON.TransformNode
  translate(axis: BABYLON.Vector3, distance: number, space?: BABYLON.Space): BABYLON.TransformNode
  set rotation(value: number)
  get rotation(): number
  set scale(value: number)
  get scale(): number
  set scaleX(value: number)
  get scaleX(): number
  set scaleY(value: number)
  get scaleY(): number

  /**
   * Sets the frame (stops current animation).
   * @param frame
   */
  setFrame(frame: number): void

  /**
   * Adds an animation. Animations can be added from this method, or from Sprite props.
   * @param animation
   */
  addAnimation(animation: SpriteAnimation): void

  /**
   * Plays an animation. Animations are defined in the Sprite decorator 'props' or manually using 'SpriteAnimation' interface.
   * @param animation Animation object or Id of a predefined animation
   * @param loopOverride Overrides the animation loop value in case needed
   * @param completed Completed animation callback
   */
  playAnimation(animation: SpriteAnimation | FlexId, options?: SpriteAnimationOptions, completed?: () => void): void

  /**
   * Stops current animation.
   */
  stopAnimation(): void

  /**
   * Subscribes a method to all keydframes of a certain Name.
   * @param keyframeId
   * @param callback
   */
  subscribeToKeyframe(keyframeId: FlexId, callback: () => void): void

  /**
   * Clears all subscriptions to a keyframe.
   * @param keyframeId
   */
  clearKeyframeSubscriptions(keyframeId: string): void

  /**
   * Writes a text on the sprite.
   * This method creates a new texture with the text size and uses it.
   * Sprite size will be affeted using this method.
   * @param text
   */
  drawText(text: string, properties: DrawBlockProperties): void

  /**
   * Destroys the sprite (release it).
   */
  destroy(): void

  /**
   * Callback invoked after the sprite has been spawned in a scene.
   */
  onSpawn?(): void

  /**
   * Callback invoked on sprite destroy.
   */
  onDestroy?(): void

  /**
   * Callback invoked on loop update.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Rect.
   */
  onCanvasResize?(size: Rect): void
}

export type SpriteConstructor = new () => SpriteInterface

export declare interface SpriteProps {
  /**
   * Load the image file from a url. Don't define to use a blank texture.
   */
  url?: string

  /**
   * Width of the sprite. In case it is an animated sprite, it represents each frame cell width.
   */
  width: number

  /**
   * Height of the sprite. In case it is an animated sprite, it represents each frame cell height.
   */
  height: number

  /**
   * Numnber of frames (total cells).
   */
  numFrames?: number

  /**
   * Animations.
   */
  animations?: SpriteAnimation[]

  /**
   * Defines if the texture has bitmaps (false by default).
   */
  noMipmap?: boolean

  /**
   * Defines if the texture is inverted on Y axis (false by default).
   */
  invertY?: boolean

  /**
   * Defines the sampling mode we want for the texture while fetching from it (BABYLON.Texture.NEAREST_SAMPLINGMODE...) (default: BABYLON.Texture.TRILINEAR_SAMPLINGMODE)
   */
  samplingMode?: number

  /**
   * Used only in Blank textures (url: undefined). Set it as 'BABYLON.Engine.TEXTUREFORMAT_???'. Default is 'BABYLON.Engine.TEXTUREFORMAT_RGBA'.
   */
  format?: number

  /**
   * Cache this sprite.
   * Cached files are kept in memory and only removed after calling KJS.clearCache().
   * Use cached files in case they are being used between more than one scene.
   * Cached sprites make shorter loading time at the expense of memory usage.
   */
  cached?: boolean
}

/**
 * Sprite decorator can be applied in three different places:
 * - To a class itself, where it will inherit extended SpriteInterface lifecycle, methods and variables.
 * - To an 'Actor' class property, where it will be created as a SpriteConstructor using the decorator props.
 * - To a 'Scene' class property, where it will be created as a SpriteConstructor using the decorator props.
 * - To a 'ActorState' or 'SceneState' class properties, where it will be created as a SpriteConstructor using the decorator props.
 * - To a 'ActorAction' or 'SceneAction' class properties, where it will be created as a SpriteConstructor using the decorator props.
 * @param props
 */
export declare function Sprite(props: SpriteProps): any
