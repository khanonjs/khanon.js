import * as BABYLON from '@babylonjs/core'

import {
  AnimationBase,
  BabylonAccessor,
  Rect
} from '../../models'
import { DrawBlockProperties } from '../../models/draw-text-properties'
import {
  FlexId,
  SpriteTransform
} from '../../types'
import { NullableExceptProps } from '../../types/nullable-except-props'
import { SceneInterface } from '../scene'

export interface SpriteAnimation extends AnimationBase {}

export declare abstract class SpriteInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): NullableExceptProps<Pick<BabylonAccessor, 'scene' | 'spriteManager' | 'sprite'>, 'spriteManager'>

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
   * Sets position
   */
  set position(value: BABYLON.Vector3)

  /**
   * Gets position
   */
  get position(): BABYLON.Vector3

  /**
   * Sets angle
   */
  set angle(value: number)

  /**
   * Gets angle
   */
  get angle(): number

  /**
   * Sets width
   */
  set width(value: number)

  /**
   * Gets width
   */
  get width(): number

  /**
   * Sets height
   */
  set height(value: number)

  /**
   * Gets height
   */
  get height(): number

  /**
   * Sets size
   */
  set size(value: number)

  /**
   * Gets size
   */
  get size(): number

  /**
   * Sets color
   */
  set color(color: BABYLON.Color4)

  /**
   * Gets color
   */
  get color(): BABYLON.Color4

  /**
   * Sets isVisible
   */
  set isVisible(visible: boolean)

  /**
   * Gets isVisible
   */
  get isVisible(): boolean

  /**
   * Sets position
   */
  set scale(scale: number)
  get scale(): number

  /**
   * Sets the scale of the sprite
   */
  set scale(scale: number)

  /**
   * Gets the scale of the sprite
   */
  get scale(): number

  /**
   * Sets the transform (translation, rotation and scale).
   * @param transform
   */
  // setTransform(transform: BABYLON.Matrix): void  // TODO

  /**
   * Gets teh transform.
   * @param transform
   */
  // getTransform(): BABYLON.Matrix // TODO

  /**
   * Sets current frame (stops current animation).
   * @param frame
   */
  setFrame(frame: number): void

  /**
   * Sets the first frame of the sprite or current animation.
   */
  setFrameFirst(): void

  /**
   * Sets the last frame of the sprite or current animation.
   */
  setFrameLast(): void

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
  playAnimation(animation: SpriteAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void

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
   * Callback invoked on sprite destroy (equivalent to onRelease).
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
   * Animations
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

  /**
   * Defines the maximum allowed number of sprites for this sprite sheet
   */
  maxAllowedSprites?: number
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
