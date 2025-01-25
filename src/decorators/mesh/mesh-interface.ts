import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { MeshAnimation } from './mesh-animation'
import { MeshAnimationOptions } from './mesh-animation-options'
import { MeshProps } from './mesh-props'

export abstract class MeshInterface implements DisplayObject {
  abstract props: MeshProps
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract animation: MeshAnimation | null
  abstract animations: Map<FlexId, MeshAnimation>
  abstract addAnimation(animation: MeshAnimation): void
  abstract release(): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'mesh' | 'scene'>
  abstract get scene(): SceneInterface
  abstract setMesh(babylonMesh: BABYLON.Mesh): void
  abstract setEnabled(value: boolean): void
  abstract setFrame(frame: number): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, options?: MeshAnimationOptions, completed?: () => void): BABYLON.AnimationGroup
  abstract stopAnimation(): void
  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void // 8a8f
  abstract clearKeyframeSubscriptions(keyframeId: string): void // 8a8f
  abstract destroy(): void

  /**
   * Tranmsform properties and methods
   */
  abstract set visibility(value: number)
  abstract get visibility(): number
  abstract get absolutePosition(): BABYLON.Vector3
  abstract get absoluteRotationQuaternion(): BABYLON.Quaternion
  abstract get absoluteScaling(): BABYLON.Vector3
  abstract set position(value: BABYLON.Vector3)
  abstract get position(): BABYLON.Vector3
  abstract set rotation(value: BABYLON.Vector3)
  abstract get rotation(): BABYLON.Vector3
  abstract set rotationQuaternion(value: BABYLON.Quaternion)
  abstract get rotationQuaternion(): BABYLON.Nullable<BABYLON.Quaternion>
  abstract set scaling(value: BABYLON.Vector3)
  abstract get scaling(): BABYLON.Vector3
  abstract addRotation(x: number, y: number, z: number): BABYLON.TransformNode
  abstract getAbsolutePivotPoint(): BABYLON.Vector3
  abstract getAbsolutePivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  abstract getAbsolutePosition(): BABYLON.Vector3
  abstract getDirection(localAxis: BABYLON.Vector3): BABYLON.Vector3
  abstract getDirectionToRef(localAxis: BABYLON.Vector3, result: BABYLON.Vector3): BABYLON.TransformNode
  abstract getPivotPoint(): BABYLON.Vector3
  abstract getPivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  abstract locallyTranslate(vector3: BABYLON.Vector3): BABYLON.TransformNode
  abstract lookAt(targetPoint: BABYLON.Vector3, yawCor?: number, pitchCor?: number, rollCor?: number, space?: BABYLON.Space): BABYLON.TransformNode
  abstract rotate(axis: BABYLON.Vector3, amount: number, space?: BABYLON.Space): BABYLON.TransformNode
  abstract rotateAround(point: BABYLON.Vector3, axis: BABYLON.Vector3, amount: number): BABYLON.TransformNode
  abstract rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): BABYLON.AbstractMesh
  abstract setAbsolutePosition(absolutePosition: BABYLON.Vector3): BABYLON.TransformNode
  abstract setDirection(localAxis: BABYLON.Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): BABYLON.TransformNode
  abstract setPivotMatrix(matrix: BABYLON.DeepImmutable<BABYLON.Matrix>, postMultiplyPivotMatrix?: boolean): BABYLON.TransformNode
  abstract setPivotPoint(point: BABYLON.Vector3, space?: BABYLON.Space): BABYLON.TransformNode
  abstract setPositionWithLocalVector(vector3: BABYLON.Vector3): BABYLON.TransformNode
  abstract translate(axis: BABYLON.Vector3, distance: number, space?: BABYLON.Space): BABYLON.TransformNode

  /**
   * User defined optional
   */
  onSpawn?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
