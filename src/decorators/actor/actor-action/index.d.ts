import { ActorInterface } from '../'
import { Rect } from '../../../models'
import { FlexId } from '../../../types'
import {
  MeshConstructor,
  MeshInterface
} from '../../mesh'
import { SceneInterface } from '../../scene'
import {
  SpriteConstructor,
  SpriteInterface
} from '../../sprite'

export declare abstract class ActorActionInterface</* Setup object */ S = any, /* Actor object */ A = ActorInterface<SpriteInterface | MeshInterface>, /* SCene object */ C = SceneInterface> {
  /**
   * Owner scene of this action.
   */
  get scene(): C

  /**
   * Owner actor of this action.
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
   */
  onPlay?(): void

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

export type ActorActionConstructor = new () => ActorActionInterface

export interface ActorActionProps {
  /**
   * All actions of a group can be stopped from 'actor.stopActionGroup'.
   */
  group?: number

  /**
   * 'false' by default. Preserves the action, not removing it after stop.
   */
  preserve?: boolean

  /**
   * List of actions to be overriden on action play.
   * NOTE: Overrides don't apply to method decorators.
   */
  overrides?: ActorActionConstructor[]

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
 * ActorAction decorator can be applied in three different places:
 * - To a class itself, where it will inherit extended ActorActionInterface lifecycle, methods and variables.
 * - To an 'Actor' class method, where it will be called as the 'onLoopUpdate' callback.
 * - To an 'ActorState' class method, where it will be called as the 'onLoopUpdate' callback.
 * @param props
 */
export declare function ActorAction(props?: ActorActionProps): any
