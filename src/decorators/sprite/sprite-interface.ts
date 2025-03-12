import * as BABYLON from '@babylonjs/core'

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
import { FlexId } from '../../types/flex-id'
import { MeshAnimation } from '../mesh/mesh-animation'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from './sprite-animation'
import { SpriteAnimationOptions } from './sprite-animatrion-options'
import { SpriteMesh } from './sprite-mesh'
import { SpriteProps } from './sprite-props'

export abstract class SpriteInterface implements DisplayObject, LoopUpdatable, CanvasResizable, TimersByContext {
  abstract _props: SpriteProps
  abstract _className: string
  abstract _spriteMesh: SpriteMesh
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _exclusiveTexture: boolean // Exclusive texture means this sprite has an exclusive texture that is not stored anywhere, so the sprite itself has to handle its release.
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
  abstract getClassName(): string
  abstract setFrame(frame: number): void
  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, options?: SpriteAnimationOptions, completed?: () => void): void
  abstract stopAnimation(): void
  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
  abstract destroy(): void

  /**
   * Tranmsform properties and methods
   */
  abstract set visibility(value: number)
  abstract get visibility(): number
  abstract get absolutePosition(): BABYLON.Vector3
  abstract set position(value: BABYLON.Vector3)
  abstract get position(): BABYLON.Vector3
  abstract set rotation(value: number)
  abstract get rotation(): number
  abstract set scale(value: number)
  abstract get scaleX(): number
  abstract set scaleX(value: number)
  abstract get scale(): number
  abstract set scaleY(value: number)
  abstract get scaleY(): number
  abstract getAbsolutePivotPoint(): BABYLON.Vector3
  abstract getAbsolutePivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  abstract getAbsolutePosition(): BABYLON.Vector3
  abstract getPivotPoint(): BABYLON.Vector3
  abstract getPivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode
  abstract locallyTranslate(vector3: BABYLON.Vector3): BABYLON.TransformNode
  abstract rotateAround(point: BABYLON.Vector3, axis: BABYLON.Vector3, amount: number): BABYLON.TransformNode
  abstract setAbsolutePosition(absolutePosition: BABYLON.Vector3): BABYLON.TransformNode
  abstract setPivotMatrix(matrix: BABYLON.DeepImmutable<BABYLON.Matrix>, postMultiplyPivotMatrix?: boolean): BABYLON.TransformNode
  abstract setPivotPoint(point: BABYLON.Vector3, space?: BABYLON.Space): BABYLON.TransformNode
  abstract setPositionWithLocalVector(vector3: BABYLON.Vector3): BABYLON.TransformNode
  abstract translate(axis: BABYLON.Vector3, distance: number, space?: BABYLON.Space): BABYLON.TransformNode

  /**
   * User defined optional
   */
  // TODO add onCustomTexture to allow users to create custom textures.
  onSpawn?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
}
