import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import {
  BabylonAccessor,
  Rect,
  Timeout
} from '../../models'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene'
import { SpriteConstructor } from '../sprite'

export abstract class ParticleInterface</* Setup object */ S = any> {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene' | 'particleSystem'>

  /**
   * Owner scene of the particle.
   */
  get scene(): SceneInterface

  /**
   * Gets the setup object.
   */
  get setup(): S

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

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
   * You need to implement this method to initialize the particle.
   * Use the 'setSprite' method to use a sprite in the particle.
   * Or you can use a custom created texture, but don't forget to release it in the 'onRemove' method.
   * @param particle
   */
  abstract onInitialize(particle: ParticleInterface): void

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
  onRemove?(): void

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
   * If *true* renders the particle over all the elements in the scene (sets *renderingGroupId* to the max value).
   * Set to *false* in a 3D scene.
   * Set to *true* in a 2D scene built by sprites if you want to make the particle visible over all the elements in the scene.
   * This property will be ignored in case *renderingGroupId* is defined.
   */
  renderOverScene: boolean

  /**
   * Rendering group Id of the particle (0 to 3).
   * In a 3D scene you can ignore this property and set *renderOverScene=false*.
   * In a 2D scene built by sprites, you need to set this property to a vale higher of the sprite behind it.
   * 2D sprites use transparent alpha blending, hiding particles behind them if they coexist with the same *renderingGroupId* than the particle.
   * E.g: In a 2D scene that has a sprite background using *renderingGroupId=0*, you will need to set the particle's *renderingGroupId=1* to see it over the background.
   * You can ignore this property and use *renderOverScene* to make the particle visible over all the elements in the scene (it sets *renderingGroupId* to the max value).
   * Read more: https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering/#rendering-groups
   */
  renderingGroupId?: number

  /**
   * Sprites to be used in this particle.
   */
  sprites?: SpriteConstructor[]

  /**
   * (0, 0, 0) by default.
   * Offset respect the attachment in case the particle is attached to an actor.
   * World position in case the particle is spawned by a scene.
   */
  position?: Vector3

  /**
   * Maximum number of particles to be emitted (2000 by default).
   */
  capacity?: number
}

export function Particle(props: ParticleProps): any
