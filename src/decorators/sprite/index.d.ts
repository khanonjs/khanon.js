import { Matrix } from '@babylonjs/core'

import {
  AnimationBase,
  BabylonAccessor,
  Rect
} from '../../models'
import { SpriteTransform } from '../../types'
import { SceneInterface } from '../scene'

export interface SpriteAnimation extends AnimationBase {}

export declare interface SpriteProps {
  /**
   * Load the image file from a url.
   */
  url?: string

  /**
   * Width of the sprite. It is required in case of using a blank texture. Not required if 'cellWidth' is defined.
   */
  width?: number

  /**
   * Height of the sprite. It is required in case of using a blank texture. Not required if 'cellHeight' is defined.
   */
  height?: number

  /**
   * Cells width. Each cell represents an animation frame. It is equivalent to the sprite width.
   * Currently it is only supported all cells of the same size.
   */
  cellWidth?: number

  /**
   * Cells height. Each cell represents an animation frame. It is equivalent to the sprite height.
   * Currently it is only supported all cells of the same size.
   */
  cellHeight?: number

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

export declare function Sprite(props: SpriteProps): any
export declare abstract class SpriteInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'spriteManager' | 'sprite'>

  /**
   * Scene owner of this Sprite.
   */
  get scene(): SceneInterface

  /**
   * Shortcut to basic transform methods and accessors.
   * Using this object is the same than accesing it through 'this.babylon.sprite'
   */
  get transform(): SpriteTransform

  /**
   * Turns ON/OFF 'onLoopUpdate' callback
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Gets the width of the sprite
   */
  get width(): number

  /**
   * Gets the height of the sprite
   */
  get height(): number

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
  setTransform(transform: Matrix): void

  /**
   * Gets teh transform.
   * @param transform
   */
  getTransform(): Matrix

  /**
   * Sets current frame (stops current animation).
   * @param frame
   */
  setFrame(frame: number): void

  /**
   * Sets the first frame of the sprite or current animation.
   */
  setFirstFrame(): void

  /**
   * Sets the last frame of the sprite or current animation.
   */
  setLastFrame(): void

  /**
   * Adds an animation. Animations can be added from this method, or from Sprite props.
   * @param animation
   */
  addAnimation(animation: SpriteAnimation): void

  /**
   * Plays an animation. Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation Animation object or ID of a predefined animation
   * @param loopOverride Overrides the animation loop value in case needed
   * @param completed Completed animation callback
   */
  playAnimation(animation: SpriteAnimation | string, loopOverride?: boolean, completed?: () => void): void

  /**
   * Stops current animation.
   */
  stopAnimation(): void

  /**
   * Subscribes a method to all keydframes of a certain Name.
   * @param keyframeId
   * @param callback
   */
  subscribeToKeyframe(keyframeId: string, callback: () => void): void

  /**
   * Clears all subscriptions to a keyframe.
   * @param keyframeId
   */
  clearKeyframeSubscriptions(keyframeId: string): void

  /**
   * Callback invoked after the sprite has been spawned in a scene.
   */
  onSpawn?(scene: SceneInterface): void

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
