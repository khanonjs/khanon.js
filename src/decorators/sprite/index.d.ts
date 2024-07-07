import {
  Matrix,
  SpriteasBabylonSprite
} from '@babylonjs/core'

import KJS from '../../kjs'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { SpriteTransform } from '../../types'
import { SceneType } from '../scene/scene-type'
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
  get scene(): SceneType

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
   * Sets a sprite manually.
   * Through this method, it is possible to manually create a Babylon Sprite in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setSprite(babylonSprite: SpriteasBabylonSprite): void

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
   * Sets current frame (stops current animation)
   * @param frame
   */
  setFrame(frame: number): void

  /**
   * Plays an animation. Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation
   * @param loopOverride
   * @param completed
   */
  playAnimation(animation: SpriteAnimation, loopOverride?: boolean, completed?: () => void): void

  /**
   * Stops current animation.
   */
  stopAnimation(): void

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
