import { ActorInterface } from '../'
import { Rect } from '../../../models/rect'
import { ActorStateProps } from './actor-state-props'

export { ActorStateProps } from './'
export declare function ActorState(props?: ActorStateProps): any
export declare class ActorStateOptions<S> {
  setup(vars: S): void
}
export declare abstract class ActorStateInterface<S = any> {
  /**
   * Actor owner of the state.
   */
  actor: ActorInterface

  /**
   * Setup of the state.
   */
  setup: S

  /**
   * Turns On/Off 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Invoked on State start. Use this method to setup the Actor according to the State start.
   * NOTE: Setup variables are not present at this point. Setup variables are applied at 'onSetup' callback.
   */
  onStart?(): void

  /**
   * Invoked after setup variables have been applied to the State.
   */
  onSetup?(): void

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
