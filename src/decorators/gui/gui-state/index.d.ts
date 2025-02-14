import {
  SceneInterface,
  SceneRemove,
  SceneSpawn
} from '../'
import { Rect } from '../../../models'
import { FlexId } from '../../../types'
import { ActorConstructor } from '../../actor'
import {
  CameraConstructor,
  CameraInterface
} from '../../camera'
import { MeshConstructor } from '../../mesh'
import { ParticleConstructor } from '../../particle'
import { SpriteConstructor } from '../../sprite'

export declare abstract class SceneStateInterface<S = any, C = SceneInterface> {
  /**
   * Initial setup of the state.
   */
  get setup(): S

  /**
   * Owner scene of this state.
   */
  get scene(): C

  /**
   * Scene spawn class.
   */
  get spawn(): SceneSpawn

  /**
   * Scene remove class.
   */
  get remove(): SceneRemove

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
   * Sets a camera.
   */
  switchCamera<C extends CameraConstructor>(camera: C, setup: InstanceType<C>['setup']): void

  /**
   * Gets the camera. Use the generic 'C' to set the returning camera type.
   */
  getCamera<C extends CameraInterface = CameraInterface>(): C

  /**
   * Notifies a message to this sstate.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Invoked on State start. Use this method to setup the Scene according to this State start.
   */
  onStart?(): void

  /**
   * Invoked on State end. Use this method to setup the Scene according to the State end.
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

export type SceneStateConstructor = new () => SceneStateInterface

export interface SceneStateProps {
  /**
   * Actors to spawn in this state.
   */
  actors?: ActorConstructor[]

  /**
   * Sprites to use in this action.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use in this action.
   */
  meshes?: MeshConstructor[]

  /**
   * Particles to use in this state.
   */
  particles?: ParticleConstructor[]
}

export declare function SceneState(props?: SceneStateProps): any
