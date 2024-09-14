import { ActorInterface } from '../'
import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types'
import {
  MeshConstructor,
  MeshInterface
} from '../../mesh'
import { ParticleConstructor } from '../../particle'
import { SceneInterface } from '../../scene'
import {
  SpriteConstructor,
  SpriteInterface
} from '../../sprite'

/**
 * Defines the state of an actor.
 * @param A Actor owner of hte state (optional).
 * @param S Setup interface (optional).
 */
export declare abstract class ActorStateInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>, C = SceneInterface> { // TODO add scene generic interface
  /**
   * Scene owner of the state.
   */
  get scene(): C

  /**
   * Actor owner of the state.
   */
  get actor(): A

  /**
   * Setup of the state.
   */
  get setup(): S

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Notifies a message to this state.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Invoked on State start. Use this method to setup the Actor according to the State start.
   */
  onStart?(): void

  /**
   * Invoked on State end. Use this method to setup the Actor according to the State end.
   */
  onEnd?(): void

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

export type ActorStateConstructor = new () => ActorStateInterface

export interface ActorStateProps {
  /**
   * Sprites to use in this state.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use in this state.
   */
  meshes?: MeshConstructor[]

  /**
   * Particles to use in this state.
   */
  particles?: ParticleConstructor[]
}

export declare function ActorState(props?: ActorStateProps): any
