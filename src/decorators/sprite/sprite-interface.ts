import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { DrawBlockProperties } from '../../models/draw-text-properties'
import { Rect } from '../../models/rect'
import { MeshTransform } from '../../types'
import { FlexId } from '../../types/flex-id'
import { NullableExceptProps } from '../../types/nullable-except-props'
import { SpriteTransform } from '../../types/sprite-transform'
import { MeshAnimation } from '../mesh/mesh-animation'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from './sprite-animation'
import { SpriteMesh } from './sprite-mesh'
import { SpriteProps } from './sprite-props'

export abstract class SpriteInterface implements DisplayObject {
  abstract props: SpriteProps
  abstract spriteMesh: SpriteMesh
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract exclusiveTexture: boolean // Exclusive texture means this sprite has an exclusive texture that is not stored anywhere, so the sprite itself has to handle its release.
  abstract animation: SpriteAnimation | null
  abstract animations: Map<FlexId, SpriteAnimation>
  abstract transform: MeshTransform
  abstract _scale: number
  abstract setMesh(spriteMesh: SpriteMesh, isExclusive: boolean, isParticle: boolean): void
  // abstract setTexture(spriteTexture: SpriteMesh, isExclusive: boolean, isParticle: boolean): void
  abstract release(): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'mesh' | 'scene'>
  abstract get scene(): SceneInterface

  // abstract set position(value: BABYLON.Vector3)
  // abstract get position(): BABYLON.Vector3
  // abstract set angle(value: number)
  // abstract get angle(): number
  // abstract set width(value: number)
  // abstract get width(): number
  // abstract set height(value: number)
  // abstract get height(): number
  // abstract set size(value: number)
  // abstract get size(): number
  // abstract set color(color: BABYLON.Color4)
  // abstract get color(): BABYLON.Color4
  // abstract set isVisible(visible: boolean)
  // abstract get isVisible(): boolean
  // abstract set scale(scale: number)
  // abstract get scale(): number
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
  abstract set visibility(value: number)
  abstract get visibility(): number

  abstract setFrame(frame: number): void
  abstract setFrameFirst(): void
  abstract setFrameLast(): void
  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void
  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
  abstract drawText(text: string, properties: DrawBlockProperties): void
  abstract destroy(): void

  /**
   * User defined optional
   */
  onSpawn?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
}
