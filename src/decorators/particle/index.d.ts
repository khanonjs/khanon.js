import * as BABYLON from '@babylonjs/core'

import {
  BabylonAccessor,
  Rect
} from '../../models'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene'
import { SpriteConstructor } from '../sprite'

export abstract class ParticleInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene' | 'particleSystem'>

  /**
   * Owner scene of the particle.
   */
  get scene(): SceneInterface

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Starts the particle.
   */
  start(): void

  /**
   * Stops the particle.
   */
  stop(): void

  /**
   * Sets the sprite for the particle system.
   * Sprite width and height is set through the 'minScaleX', 'maxScaleX', 'minScaleY' and 'maxScaleY' of the particleSystem properties.
   * If you want to keep the width and height ratio of the particle, don't change those properties, use 'minSize' and 'maxSize' for the particle size.
   * @param sprite
   */
  setSprite(sprite: SpriteConstructor): void

  /**
   * Sets the animation of the particle sprite.
   * @param id
   * @param cellChangeSpeed
   * @param randomStartCell
   */
  setAnimation(id: FlexId, cellChangeSpeed?: number, randomStartCell?: boolean): void

  /**
   * Initialize the particle.
   * You can use a custom created texture (remember to release it in the 'onRelease' method).
   * Or you can set a sprite texture using 'setSprite' method.
   * @param particle
   */
  abstract initialize(particle: ParticleInterface): void

  /**
   * Notifies a message to this particle.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Callback invoked on particle start.
   */
  onStart?(): void

  /**
   * Callback invoked on particle stop.
   */
  onStop?(): void

  /**
   * Callback invoked on particle release (dispose).
   */
  onRelease?(): void

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

export type ParticleConstructor = new () => ParticleInterface

export interface ParticleProps {
  /**
   * Sprites to be used in this particle.
   */
  sprites?: SpriteConstructor[]

  /**
   * Offset position respect the attachment in case the particle is attached to an actor.
   * World position in case the particle is created by a scene.
   */
  offset?: BABYLON.Vector3

  /**
   * Maximum number of particles to be emitted.
   */
  capacity?: number
}

export function Particle(props?: ParticleProps): any
