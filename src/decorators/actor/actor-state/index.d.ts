import { ActorInterface } from '../'
import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types'
import { MeshInterface } from '../../mesh'
import { SceneInterface } from '../../scene'
import { SpriteInterface } from '../../sprite'

/**
 * Defines the state of an actor.
 * @param A Actor owner of hte state (optional).
 * @param S Setup interface (optional).
 */
export declare abstract class ActorStateInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>> {
  /**
   * Scene owner of the state.
   */
  get scene(): SceneInterface

  /**
   * Actor owner of the state.
   */
  get actor(): A

  /**
   * Setup of the state.
   */
  get setup(): S

  /**
   * Turns On/Off 'onLoopUpdate' callback.
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
   * Invoked on State end. Use this method to setup the actor according to the State end.
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

}

export declare function ActorState(props?: ActorStateProps): any
