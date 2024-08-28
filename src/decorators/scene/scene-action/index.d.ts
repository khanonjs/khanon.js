import { SceneInterface } from '../'
import { Rect } from '../../../models'
import { MeshConstructor } from '../../mesh'
import { SpriteConstructor } from '../../sprite'

export declare abstract class SceneActionInterface</* Setup object */ S = any, /* Scene object */ C = SceneInterface> {
  /**
   * Scene owner of the action.
   */
  get scene(): C

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
   * Stops the action. Equivalent to calling 'scene.stopAction'.
   */
  stop(): void

  /**
   * Removes the action. Equivalent to calling 'actor.removeAction'.
   */
  remove(): void

  /**
   * Invoked on action start. Use this method to setup the Actor according to the action start.
   */
  onStart?(): void

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

export type SceneActionConstructor = new () => SceneActionInterface

export interface SceneActionProps {
  /**
   * All actions of a group can be stopped from 'actor.stopActionGroup'.
   */
  group?: number

  /**
   * 'false' by default. Preserves the action instance, not removing it after stop.
   */
  preserve?: boolean

  /**
   * List of actions to be overriden on action play.
   * NOTE: Overrides don't apply to method decorators.
   */
  overrides?: SceneActionConstructor[]

  /**
   * Count of number of frames this action is executed.
   */
  countFrames?: number

  /**
   * Sprites to use in this action.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use in this action.
   */
  meshes?: MeshConstructor[]
}

/**
 * SceneAction decorator can be applied in three different places:
 * - To a class itself, where it will inherit extended SceneActionInterface lifecycle, methods and variables.
 * - To an 'Scene' class method, where it will be called as the 'onLoopUpdate' callback.
 * - To an 'SceneState' class method, where it will be called as the 'onLoopUpdate' callback.
 * @param props
 */
export declare function SceneAction(props?: SceneActionProps): any
