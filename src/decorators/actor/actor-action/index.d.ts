import { ActorInterface } from '../'
import {
  Rect,
  Timeout
} from '../../../models'
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

export declare class ActorActionInterface</* Setup object */ S = any, /* Scene object */ C = SceneInterface, /* Actor object */ A = ActorInterface<SpriteInterface | MeshInterface>> {
  /**
   * Setup of the action.
   */
  get setup(): S

  /**
   * Owner scene of this action.
   */
  get scene(): C

  /**
   * Owner actor of this action.
   */
  get actor(): A

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Returns 'true' if the action is playing.
   */
  get isPlaying(): boolean

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
  setTimeout(func: () => void, ms: number, context?: any): Timeout

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
   * Plays the action in case it has been stopped before and it is preserved (props.preserve = true).
   * This way the action itself controls when it has to stop and play.
   */
  play(): void

  /**
   * Stops the action. The action is removed if it is not preserved (props.preserve = false).
   */
  stop(): void

  /**
   * Removes the action.
   */
  remove(): void

  /**
   * Invoked on action start.
   */
  onPlay?(): void

  /**
   * Invoked on action stop. If 'props.preserved' is 'true', the action instance will remain alive waiting for another 'playAction'.
   */
  onStop?(): void

  /**
   * Invoked on action remove.
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

export type ActorActionConstructor = new () => ActorActionInterface

export interface ActorActionProps {
  /**
   * All actions of a group can be stopped from 'actor.stopActionGroup'.
   */
  group?: FlexId

  /**
   * By default 'false'.
   *
   * If preserve is 'false', the action is removed after stop it. The next action play will create a new instance.
   * If preserve is 'true', the action is preserved after stop it, keeping the instance and being able to be played again with last values.
   */
  preserve?: boolean

  /**
   * List of actions to be overriden on action play.
   * In case it is a string, it makes reference to the method name of an action defined as a class method.
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

  /**
   * Particles to use in this action.
   */
  particles?: ParticleConstructor[]
}

/**
 * ActorAction decorator can be applied in three different places:
 * - To a class itself, where it will inherit extended ActorActionInterface lifecycle, methods and variables.
 * - To an 'Actor' class method, where it will be called as the 'onLoopUpdate' callback.
 * - To an 'ActorState' class method, where it will be called as the 'onLoopUpdate' callback.
 * @param props
 */
export declare function ActorAction(props?: ActorActionProps): any
