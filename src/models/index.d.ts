import * as BABYLON from '@babylonjs/core'
import * as BABYLONGUI from '@babylonjs/gui'

import { FlexId } from '../types'
import { Rect } from './rect'

export declare interface AnimationKeyFrame {
  /**
   * Id of the keyframe.
   */
  id: FlexId

  /**
   * Frames to trigger the emitter.
   */
  frames: number[]
}

export declare interface AnimationBase {
  /**
   * Id of the animation.
   */
  id: FlexId

  /**
   * Indicates if the animation is cyclic, 'false' by default.
   * This property is omitted in particles.
   */
  loop?: boolean

  /**
   * Each Key frame emit an event when the frame/s are reached.
   */
  keyFrames?: AnimationKeyFrame[]
}

export interface BabylonAccessor<
    C extends BABYLON.Camera = BABYLON.Camera,
    M extends BABYLON.AbstractMesh = BABYLON.AbstractMesh,
    N extends BABYLON.Material = BABYLON.Material
  > {
  camera: C
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  sprite: BABYLON.Sprite
  mesh: M
  spriteManager: BABYLON.SpriteManager
  particleSystem: BABYLON.ParticleSystem
  texture: BABYLON.Texture | BABYLON.DynamicTexture
  material: N
  gui: BABYLONGUI.AdvancedDynamicTexture
}

export interface DrawBlockProperties {
  /**
   * Font name (CSS fontface).
   */
  fontName: string

  /**
   * Font size.
   */
  fontSize: number

  /**
   * Text color (HTML format).
   */
  textColor: string

  /**
   * Font style (bold, italic, etc..).
   */
  fontStyle?: string

  /**
   * Background color (Deefault is transparent background).
   */
  bgColor?: string

  /**
   * Center horizontally ('true' by default).
   */
  centerH?: boolean

  /**
   * Center vertically ('true' by default).
   */
  centerV?: boolean

  /**
   * Texture size (Default fits text to whole area).
   */
  textureSize?: Rect
}

export { AssetType } from './asset-type'
export { DrawBlockProperties } from './draw-block-properties'
export { Rect } from './rect'
export declare class Timeout {}
export { TransformComposition } from './transform-composition'
