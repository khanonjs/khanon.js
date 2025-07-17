import { Space } from '@babylonjs/core/Maths/math.axis'
import {
  Matrix,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Observer } from '@babylonjs/core/Misc/observable'

import {
  CanvasResizable,
  DisplayObject,
  LoopUpdatable
} from '../../base'
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { DrawBlockProperties } from '../../models/draw-block-properties'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { SpriteTransform } from '../../types'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from './sprite-animation'
import { SpriteAnimationOptions } from './sprite-animatrion-options'
import { SpriteMesh } from './sprite-mesh'
import { SpriteProps } from './sprite-props'

export abstract class SpriteInterface implements DisplayObject, LoopUpdatable, CanvasResizable, TimersByContext, SpriteTransform {
  abstract _props: SpriteProps
  abstract _className: string
  abstract _spriteMesh: SpriteMesh
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: Observer<number>
  abstract _canvasResize$: Observer<Rect>
  abstract _exclusiveSpriteMesh: boolean // Exclusive texture means this sprite has an exclusive texture that is not stored anywhere, so the sprite itself has to handle its release.
  abstract _setSpriteMesh(spriteMesh: SpriteMesh, isExclusive: boolean, isParticle: boolean): void
  abstract _setShaderMaterialTextureFrame(frame: number): void
  abstract _animation: SpriteAnimation | null
  abstract _animations: Map<FlexId, SpriteAnimation>
  abstract _keyFramesTimeouts: Timeout[]
  abstract _removeAnimationKeyFrames(): void
  abstract _removeEndAnimationTimer(): void
  abstract _release(): void

  /**
   * User available
   */
  abstract getClassName(): string
  abstract drawText(text: string, properties: DrawBlockProperties): void
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void

  /**
   * User available Display Object
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'mesh' | 'scene'>
  abstract get scene(): SceneInterface
  abstract get enabled(): boolean
  abstract set enabled(value: boolean)
  abstract get animation(): SpriteAnimation | null
  abstract setFrame(frame: number): void
  abstract addAnimation(animation: SpriteAnimation): void
  abstract playAnimation(animation: FlexId, options?: SpriteAnimationOptions, completed?: () => void): void
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
  abstract set position(value: Vector3)
  abstract get position(): Vector3
  abstract set rotation(value: number)
  abstract get rotation(): number
  abstract set scale(value: number)
  abstract get scaleX(): number
  abstract set scaleX(value: number)
  abstract get scale(): number
  abstract set scaleY(value: number)
  abstract get scaleY(): number
  abstract getAbsolutePivotPoint(): Vector3
  abstract getAbsolutePivotPointToRef(result: Vector3): TransformNode
  abstract getAbsolutePosition(): Vector3
  abstract getPivotPoint(): Vector3
  abstract getPivotPointToRef(result: Vector3): TransformNode
  abstract locallyTranslate(vector3: Vector3): TransformNode
  abstract rotateAround(point: Vector3, axis: Vector3, amount: number): TransformNode
  abstract setAbsolutePosition(absolutePosition: Vector3): TransformNode
  abstract setPivotMatrix(matrix: Matrix, postMultiplyPivotMatrix?: boolean): TransformNode
  abstract setPivotPoint(point: Vector3, space?: Space): TransformNode
  abstract setPositionWithLocalVector(vector3: Vector3): TransformNode
  abstract translate(axis: Vector3, distance: number, space?: Space): TransformNode

  /**
   * User defined optional
   */
  // FEAT add onCustomTexture to allow users to create custom textures. Set isExclusive to true.
  onSpawn?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
}
