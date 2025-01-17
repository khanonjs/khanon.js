import * as BABYLON from '@babylonjs/core'

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

export declare abstract class MeshInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'mesh' | 'scene'>

  /**
   * Scene this Mesh belongs to.
   */
  get scene(): SceneInterface

  /**
   * Shortcut to basic transform methods and accessors.
   * Using this object is the same than accesing these methods through 'this.babylon.mesh'.
   */
  get t(): MeshTransform
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
  onSpawn?(): void

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
  /**
   * Url of the babylon scene file.
   * The loaded mesh will be the 'meshId' mesh within the babylon file, ignoring all other elements.
   */
  url?: string

  /**
   * Mesh Id to be loaded from the .babylon scene file.
   */
  meshId?: string

  /**
   * Cache this mesh.
   * Cached files are kept in memory and only removed after calling KJS.clearCache().
   * Use cached files in case they are being used between more than one scene.
   * Cached meshes make shorter loading time at the expense of memory usage.
   */
  cached?: boolean

  /**
   * By default 'false'.
   * If 'true', clone this mesh by instances. This means every actor using it will share the same mesh, not allowing to modify or using shaders with it.
   * Use it in case you want to impove performance and memory usage (E.g. simple actors with no shading effects, the crowd at a basketball game, etc).
   * If 'false', the mesh will be cloned by reference, creating a new mesh per element, and allowing to modify it and use shaders.
   */
  cloneByInstances?: boolean
}

/**
 * Mesh decorator can be defined in three different contexts:
 * - A class itself, where it will inherit extended MeshInterface lifecycle, methods and variables.
 * - To an 'Actor' class property, where it will be created as a MeshConstructor using the decorator props.
 * - To a 'Scene' class property, where it will be created as a MeshConstructor using the decorator props.
 * - To a 'ActorState' or 'SceneState' class properties, where it will be created as a MeshConstructor using the decorator props.
 * - To a 'ActorAction' of 'SceneAction' class properties, where it will be created as a MeshConstructor using the decorator props.
 * @param props
 */
export declare function Mesh(props?: MeshProps): any
