import { Animation } from '@babylonjs/core/Animations/animation'
import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup'
import { Space } from '@babylonjs/core/Maths/math.axis'
import {
  Matrix,
  Quaternion,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Observer } from '@babylonjs/core/Misc/observable'
import {
  DeepImmutable,
  Nullable
} from '@babylonjs/core/types'

import {
  CanvasResizable,
  DisplayObject,
  LoopUpdatable
} from '../../base'
import {} from '../../base/interfaces/canvas-resizable'
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { MeshTransform } from '../../types'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'
import { MeshAnimation } from './mesh-animation'
import { MeshAnimationOptions } from './mesh-animation-options'
import { MeshProps } from './mesh-props'

export abstract class MeshInterface implements DisplayObject, LoopUpdatable, CanvasResizable, TimersByContext, MeshTransform {
  abstract _props: MeshProps
  abstract _className: string
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: Observer<number>
  abstract _canvasResize$: Observer<Rect>
  abstract _animationCreateEvent(aniGroup: AnimationGroup): Animation
  abstract _animationCreateTemporalTarget(ani: Animation): void
  abstract _getMeshHierarchy(): AbstractMesh[]
  abstract _animation: MeshAnimation | null
  abstract _animations: Map<FlexId, MeshAnimation>
  abstract _release(): void

  /**
   * User available
   */
  abstract getClassName(): string
  abstract setMesh(babylonMesh: Mesh): void
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
  abstract setMaterialTransparencyMode(value: number, applyToHierarchy?: boolean): void

  /**
   * User available Display Object
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'mesh' | 'scene'>
  abstract get scene(): SceneInterface
  abstract get enabled(): boolean
  abstract set enabled(value: boolean)
  abstract get animation(): MeshAnimation | null
  abstract setFrame(frame: number): void
  abstract addAnimation(animation: MeshAnimation): void
  abstract playAnimation(animation: FlexId, options?: MeshAnimationOptions, completed?: () => void): AnimationGroup
  abstract stopAnimation(): void
  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
  abstract destroy(): void

  /**
   * Tranmsform properties and methods
   */
  abstract set visibility(value: number)
  abstract get visibility(): number
  abstract get absolutePosition(): Vector3
  abstract get absoluteRotationQuaternion(): Quaternion
  abstract get absoluteScaling(): Vector3
  abstract set position(value: Vector3)
  abstract get position(): Vector3
  abstract set rotation(value: Vector3)
  abstract get rotation(): Vector3
  abstract set rotationQuaternion(value: Quaternion)
  abstract get rotationQuaternion(): Nullable<Quaternion>
  abstract set scaling(value: Vector3)
  abstract get scaling(): Vector3
  abstract addRotation(x: number, y: number, z: number): TransformNode
  abstract getAbsolutePivotPoint(): Vector3
  abstract getAbsolutePivotPointToRef(result: Vector3): TransformNode
  abstract getAbsolutePosition(): Vector3
  abstract getDirection(localAxis: Vector3): Vector3
  abstract getDirectionToRef(localAxis: Vector3, result: Vector3): TransformNode
  abstract getPivotPoint(): Vector3
  abstract getPivotPointToRef(result: Vector3): TransformNode
  abstract locallyTranslate(vector3: Vector3): TransformNode
  abstract lookAt(targetPoint: Vector3, yawCor?: number, pitchCor?: number, rollCor?: number, space?: Space): TransformNode
  abstract rotate(axis: Vector3, amount: number, space?: Space): TransformNode
  abstract rotateAround(point: Vector3, axis: Vector3, amount: number): TransformNode
  abstract rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): AbstractMesh
  abstract setAbsolutePosition(absolutePosition: Vector3): TransformNode
  abstract setDirection(localAxis: Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): TransformNode
  abstract setPivotMatrix(matrix: DeepImmutable<Matrix>, postMultiplyPivotMatrix?: boolean): TransformNode
  abstract setPivotPoint(point: Vector3, space?: Space): TransformNode
  abstract setPositionWithLocalVector(vector3: Vector3): TransformNode
  abstract translate(axis: Vector3, distance: number, space?: Space): TransformNode

  /**
   * User defined optional
   */
  onSpawn?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
