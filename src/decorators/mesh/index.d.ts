import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import {
  AnimationBase,
  BabylonAccessor,
  Rect
} from '../../models'
import {
  FlexId,
  MeshTransform
} from '../../types'
import { SceneInterface } from '../scene'

export interface MeshAnimation extends AnimationBase {}

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
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Sets a mesh manually.
   * Through this method, it is possible to manually create a Babylon Mesh in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setMesh(babylonMesh: BABYLON.Mesh): void

  /**
   * Sets the transform (translation, rotation and scale).
   * @param transform
   */
  // setTransform(transform: BABYLON.Matrix): void  // TODO

  /**
   * Gets the transform.
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
  addAnimation(animation: MeshAnimation): void

  /**
   * Plays an animation. Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation Animation object or ID of a predefined animation
   * @param loopOverride Overrides the animation loop value in case needed
   * @param completed Completed animation callback
   */
  playAnimation(animation: MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void

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
   * Removes the mesh from the scene.
   */
  destroy(): void

  /**
   * Callback invoked after the mesh has been spawned in a scene.
   */
  onSpawn?(scene: SceneInterface): void

  /**
   * Callback invoked on mesh destroy (equivalent to onRelease).
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

export type MeshConstructor = new () => MeshInterface

export interface MeshProps {
}

/**
 * Mesh decorator can be applied in three different places:
 * - To a class itself, where it will inherit extended MeshInterface lifecycle, methods and variables.
 * - To an 'Actor' class property, where it will be created as a MeshConstructor using the decorator props.
 * - To a 'Scene' class property, where it will be created as a MeshConstructor using the decorator props.
 * - To a 'ActorState' or 'SceneState' class properties, where it will be created as a MeshConstructor using the decorator props.
 * - To a 'ActorAction' of 'SceneAction' class properties, where it will be created as a MeshConstructor using the decorator props.
 * @param props
 */
export declare function Mesh(props?: MeshProps): any
