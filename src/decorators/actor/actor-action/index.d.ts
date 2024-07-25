import { ActorInterface } from '../'
import { Rect } from '../../../models/rect'
import { MeshInterface } from '../../mesh'
import { SpriteInterface } from '../../sprite'
import { ActorActionProps } from './actor-action-props'

export { ActorActionProps } from './'
/**
 * ActorAction decorator can be applied in three different places:
 * - To a class itself, where it will inherit extended ActorActionInterface lifecycle, methods and variables.
 * - To an 'Actor' class method, where it will be called as the 'onLoopUpdate' callback.
 * - To an 'ActorState' class method, where it will be called as the 'onLoopUpdate' callback.
 * @param props
 */
export declare function ActorAction(props?: ActorActionProps): any
export declare class ActorActionOptions<S> {
  setup(vars: S): void
}
export declare abstract class ActorActionInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>> {
  /**
   * Actor owner of the action.
   */
  get actor(): A

  /**
   * Setup of the action.
   */
  get setup(): S

  /**
   * Turns On/Off 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Stops the action. Equivalent to calling 'actor.stopAction'.
   */
  stop(): void

  /**
   * Invoked on action start. Use this method to setup the Actor according to the action start.
   * NOTE: Setup variables are not present at this point. Setup variables are applied at 'onSetup' callback.
   */
  onPlay?(): void

  /**
   * Invoked after setup variables have been applied to the action.
   */
  onSetup?(): void

  /**
   * Invoked on action stop. If 'props.preserved' is 'true', the action instance will remain alive waiting for another 'playAction'.
   */
  onStop?(): void

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
