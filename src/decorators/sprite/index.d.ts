import { Space } from '@babylonjs/core/Maths/math.axis'
import {
  Matrix,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { DeepImmutable } from '@babylonjs/core/types'

import {
  AnimationBase,
  BabylonAccessor,
  Rect,
  Timeout
} from '../../models'
import { DrawBlockProperties } from '../../models/draw-block-properties'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene'
import { SpriteAnimationOptions } from './sprite-animatrion-options'

export { SpriteAnimationOptions } from './sprite-animatrion-options'

export declare interface SpriteAnimation extends AnimationBase {
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
  get animation(): SpriteAnimation | null

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
  get absolutePosition(): Vector3
  set position(value: Vector3)
  get position(): Vector3
  getAbsolutePivotPoint(): Vector3
  getAbsolutePivotPointToRef(result: Vector3): TransformNode
  getAbsolutePosition(): Vector3
  getPivotPoint(): Vector3
  getPivotPointToRef(result: Vector3): TransformNode
  locallyTranslate(vector3: Vector3): TransformNode
  rotateAround(point: Vector3, axis: Vector3, amount: number): TransformNode
  setAbsolutePosition(absolutePosition: Vector3): TransformNode
  setDirection(localAxis: Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): TransformNode
  setPivotMatrix(matrix: DeepImmutable<Matrix>, postMultiplyPivotMatrix?: boolean): TransformNode
  setPivotPoint(point: Vector3, space?: Space): TransformNode
  setPositionWithLocalVector(vector3: Vector3): TransformNode
  translate(axis: Vector3, distance: number, space?: Space): TransformNode
  set rotation(value: number)
  get rotation(): number
  set scale(value: number)
  get scale(): number
  set scaleX(value: number)
  get scaleX(): number
  set scaleY(value: number)
  get scaleY(): number

  /**
   * Returns the name of the class.
   */
  getClassName(): string

  /**
   * Sets a timeout.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setTimeout(func: () => void, ms: number): Timeout

  /**
   * Sets an interval.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setInterval(func: () => void, ms: number): Timeout

  /**
   * Clears a timeout in this context.
   * @param timeout
   */
  clearTimeout(timeout: Timeout): void

  /**
   * Clears an interval in this context.
   * @param timeout
   */
  clearInterval(timeout: Timeout): void

  /**
   * Clear all timeouts and intervals in this context.
   */
  clearAllTimeouts(): void

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
  playAnimation(animation: FlexId, options?: SpriteAnimationOptions, completed?: () => void): void

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
   * Width of the sprite for blank sprites.
   */
  width?: number

  /**
   * Height of the sprite for blank sprites.
   */
  height?: number

  /**
   * Animated sprite cell width.
   */
  cellWidth?: number

  /**
   * Animated sprite cell height.
   */
  cellHeight?: number

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
   * Rendering group Id of the sprite (0 to 3).
   * Read more: https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-groups
   */
  renderingGroupId?: number
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
export declare function Sprite(props?: SpriteProps): any
