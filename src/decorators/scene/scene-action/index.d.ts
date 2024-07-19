import { SceneInterface } from '../'
import { Rect } from '../../../models/rect'
import { SceneActionProps } from './scene-action-props'

export { SceneActionProps } from './'
/**
 * SceneAction decorator can be applied in three different places:
 * - To a class itself, where it will inherit extended SceneActionInterface lifecycle, methods and variables.
 * - To an 'Scene' class method, where it will be called as the 'onLoopUpdate' callback.
 * - To an 'SceneState' class method, where it will be called as the 'onLoopUpdate' callback.
 * @param props
 */
export declare function SceneAction(props?: SceneActionProps): any
export declare class SceneActionOptions<S> {
  setup(vars: S): void
}
export declare abstract class SceneActionInterface<S = any> {
  /**
   * Scene owner of the action.
   */
  scene: SceneInterface

  /**
   * Setup of the action.
   */
  setup: S

  /**
   * Turns On/Off 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Invoked on action start. Use this method to setup the Actor according to the action start.
   * NOTE: Setup variables are not present at this point. Setup variables are applied at 'onSetup' callback.
   */
  onStart?(): void

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
