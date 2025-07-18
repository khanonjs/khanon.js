import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup'
import { Space } from '@babylonjs/core/Maths/math.axis'
import {
  Matrix,
  Quaternion,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import {
  AbstractMesh,
  Mesh as BabylonMesh
} from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import {
  DeepImmutable,
  Nullable
} from '@babylonjs/core/types'

import {
  AnimationBase,
  BabylonAccessor,
  Rect,
  Timeout
} from '../../models'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene'
import { MeshAnimationOptions } from './mesh-animation-options'

export { MeshAnimationOptions } from './mesh-animation-options'

export interface MeshAnimation extends AnimationBase {
  /**
   * Babylon animaation group class:
   */
  animationGroup: AnimationGroup

  /**
   * Animation speed ratio (1 by default).
   */
  speedRatio?: number
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
   * Sets or gets the mesh enable state.
   */
  set enabled(value: boolean)
  get enabled(): boolean

  /**
   * Mesh transform properties.
   */
  get absolutePosition(): Vector3
  get absoluteRotationQuaternion(): Quaternion
  get absoluteScaling(): Vector3
  set position(value: Vector3)
  get position(): Vector3
  set rotation(value: Vector3)
  get rotation(): Vector3
  set rotationQuaternion(value: Quaternion)
  get rotationQuaternion(): Nullable<Quaternion>
  set scaling(value: Vector3)
  get scaling(): Vector3
  addRotation(x: number, y: number, z: number): TransformNode
  getAbsolutePivotPoint(): Vector3
  getAbsolutePivotPointToRef(result: Vector3): TransformNode
  getAbsolutePosition(): Vector3
  getDirection(localAxis: Vector3): Vector3
  getDirectionToRef(localAxis: Vector3, result: Vector3): TransformNode
  getPivotPoint(): Vector3
  getPivotPointToRef(result: Vector3): TransformNode
  locallyTranslate(vector3: Vector3): TransformNode
  lookAt(targetPoint: Vector3, yawCor?: number, pitchCor?: number, rollCor?: number, space?: Space): TransformNode
  rotate(axis: Vector3, amount: number, space?: Space): TransformNode
  rotateAround(point: Vector3, axis: Vector3, amount: number): TransformNode
  rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): AbstractMesh
  setAbsolutePosition(absolutePosition: Vector3): TransformNode
  setDirection(localAxis: Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): TransformNode
  setPivotMatrix(matrix: DeepImmutable<Matrix>, postMultiplyPivotMatrix?: boolean): TransformNode
  setPivotPoint(point: Vector3, space?: Space): TransformNode
  setPositionWithLocalVector(vector3: Vector3): TransformNode
  translate(axis: Vector3, distance: number, space?: Space): TransformNode

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
   * Sets a mesh manually.
   * Through this method, it is possible to manually create a Babylon Mesh in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setMesh(babylonMesh: BabylonMesh): void

  /**
   * Sets the material transparency mode. Apply it to the full hierarchy if *applyToHierarchy* is *true*.
   * Set the value to one of the BABYLON.Material.MATERIAL_XXXXXX modes.
   * Read more: https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering
   * @param value
   * @param applyToHierarchy
   */
  setMaterialTransparencyMode(value: number, applyToHierarchy?: boolean): void

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
  playAnimation(animation: FlexId, options?: MeshAnimationOptions, completed?: () => void): AnimationGroup

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
   * By default *false*.
   * If *true*, clone this mesh by instances. This means every actor using it will share the same mesh, not allowing to modify or using shaders with it.
   * Use it in case you want to impove performance and memory usage (E.g. simple actors with no shading effects, the crowd at a basketball game, etc).
   * If *false*, the mesh will be cloned by reference, creating a new mesh per element, and allowing to modify it and use shaders.
   * Read more: https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances
   */
  cloneByInstances?: boolean

  /**
   * Rendering group Id of the mesh (0 to 3).
   * Read more: https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-groups
   */
  renderingGroupId?: number
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
