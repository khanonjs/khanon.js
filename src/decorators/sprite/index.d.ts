import { Matrix } from '@babylonjs/core'

import KJS from '../../kjs'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { SpriteTransform } from '../../types'
import { SpriteAnimation } from './sprite-animation'
import { SpriteProps } from './sprite-props'

export { SpriteProps } from './decorators/sprite/sprite-props'
export { SpriteAnimation } from './decorators/sprite/sprite-animation'
export declare function Sprite(props: SpriteProps): any
export declare abstract class SpriteInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'spriteManager' | 'sprite'>

  /**
   * Scene this Sprite belongs to.
   */
  get scene(): KJS.Scene

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
   * @param keyframeName
   * @param callback
   */
  subscribeToKeyframe(keyframeName: string, callback: () => void): void

  /**
   * Clears all subscriptions to a keyframe.
   * @param keyframeName
   */
  clearKeyframeSubscriptions(keyframeName: string): void

  /**
   * Callback invoked after the sprite has been spawned in a scene.
   */
  onSpawn?(scene: KJS.Scene): void

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
