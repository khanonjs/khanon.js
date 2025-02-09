import * as BABYLON from '@babylonjs/core'

import {
  AnimationBase,
  BabylonAccessor,
  Rect
} from '../../models'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene'
import { MeshAnimationOptions } from './mesh-animation-options'

export { MeshAnimationOptions } from './mesh-animation-options'

export interface MeshAnimation extends AnimationBase {
  /**
   * Babylon animaation group class:
   */
  animationGroup: BABYLON.AnimationGroup
}

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
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Gets the current animation.
   */
  get animation(): MeshAnimation

  /**
   * Mesh visiiility.
   */
  set visibility(value: number)
  get visibility(): number

  /**
   * Mesh transform properties.
   */
  get absolutePosition(): BABYLON.Vector3
  get absoluteRotationQuaternion(): BABYLON.Quaternion
  get absoluteScaling(): BABYLON.Vector3
  set position(value: BABYLON.Vector3)
  get position(): BABYLON.Vector3
  set rotation(value: BABYLON.Vector3)
  get rotation(): BABYLON.Vector3
  set rotationQuaternion(value: BABYLON.Quaternion)
  get rotationQuaternion(): BABYLON.Nullable<BABYLON.Quaternion>
  set scaling(value: BABYLON.Vector3)
  get scaling(): BABYLON.Vector3
  addRotation(x: number, y: number, z: number): BABYLON.TransformNode
  getAbsolutePivotPoint(): BABYLON.Vector3
  getAbsolutePivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  getAbsolutePosition(): BABYLON.Vector3
  getDirection(localAxis: BABYLON.Vector3): BABYLON.Vector3
  getDirectionToRef(localAxis: BABYLON.Vector3, result: BABYLON.Vector3): BABYLON.TransformNode
  getPivotPoint(): BABYLON.Vector3
  getPivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  locallyTranslate(vector3: BABYLON.Vector3): BABYLON.TransformNode
  lookAt(targetPoint: BABYLON.Vector3, yawCor?: number, pitchCor?: number, rollCor?: number, space?: BABYLON.Space): BABYLON.TransformNode
  rotate(axis: BABYLON.Vector3, amount: number, space?: BABYLON.Space): BABYLON.TransformNode
  rotateAround(point: BABYLON.Vector3, axis: BABYLON.Vector3, amount: number): BABYLON.TransformNode
  rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): BABYLON.AbstractMesh
  setAbsolutePosition(absolutePosition: BABYLON.Vector3): BABYLON.TransformNode
  setDirection(localAxis: BABYLON.Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): BABYLON.TransformNode
  setPivotMatrix(matrix: BABYLON.DeepImmutable<BABYLON.Matrix>, postMultiplyPivotMatrix?: boolean): BABYLON.TransformNode
  setPivotPoint(point: BABYLON.Vector3, space?: BABYLON.Space): BABYLON.TransformNode
  setPositionWithLocalVector(vector3: BABYLON.Vector3): BABYLON.TransformNode
  translate(axis: BABYLON.Vector3, distance: number, space?: BABYLON.Space): BABYLON.TransformNode

  /**
   * Sets a mesh manually.
   * Through this method, it is possible to manually create a Babylon Mesh in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setMesh(babylonMesh: BABYLON.Mesh): void

  /**
   * Sets the mesh enable state.
   * @param value
   */
  setEnabled(value: boolean): void

  /**
   * Sets the frame (stops current animation).
   * @param frame
   */
  setFrame(frame: number): void

  /**
   * Adds an animation. Animations can be added from this method, or from Mesh props.
   * @param animation
   */
  addAnimation(animation: MeshAnimation): void

  /**
   * Plays an animation. Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * Note that meshes have the animations integrated in the 'glTF' file, so you can't add an animation manually.
   * @param animation Animation object or ID of a predefined animation
   * @param loopOverride Overrides the animation loop value in case needed
   * @param completed Completed animation callback. It is called everytime the animation ends, no matter if it is in loop or not
   * @returns BABYLON.AnimationGroup object: https://doc.babylonjs.com/typedoc/classes/BABYLON.AnimationGroup
   */
  playAnimation(animation: FlexId, options?: MeshAnimationOptions, completed?: () => void): BABYLON.AnimationGroup

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
   * Callback invoked on mesh destroy.
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
   * Url of the 'glTF' mesh file.
   */
  url?: string

  /**
   * Animations.
   */
  animations?: Omit<MeshAnimation, 'animationGroup'>[]

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
   * Read more here: https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances
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
