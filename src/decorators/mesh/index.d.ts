import {
  Matrix,
  MeshasBabylonMesh
} from '@babylonjs/core'

import { DisplayObject } from '../../base'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { MeshTransform } from '../../types'
import { SceneInterface } from '../scene'
import { MeshAnimation } from './mesh-animation'
import { MeshProps } from './mesh-props'

export { MeshProps } from './decorators/mesh/mesh-props'
export { MeshAnimation } from './decorators/mesh/mesh-animation'
export declare function Mesh(props?: MeshProps): any
export declare abstract class MeshInterface implements DisplayObject {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'mesh'>

  /**
   * Scene this Mesh belongs to.
   */
  get scene(): SceneInterface

  /**
   * Shortcut to basic transform methods and accessors.
   * Using this object is the same than accesing it through 'this.babylon.mesh'.
   */
  get transform(): MeshTransform

  /**
   * Turns ON/OFF 'onLoopUpdate' callback
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Sets a mesh manually.
   * Through this method, it is possible to manually create a Babylon Mesh in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setMesh(babylonMesh: MeshasBabylonMesh): void

  /**
   * Sets the transform (translation, rotation and scale).
   * @param transform
   */
  setTransform(transform: Matrix): void

  /**
   * Gets the transform.
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
  addAnimation(animation: MeshAnimation): void

  /**
   * Plays an animation. Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation Animation object or ID of a predefined animation
   * @param loopOverride Overrides the animation loop value in case needed
   * @param completed Completed animation callback
   */
  playAnimation(animation: MeshAnimation | string, loopOverride?: boolean, completed?: () => void): void

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
   * Callback invoked after the mesh has been spawned in a scene.
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
