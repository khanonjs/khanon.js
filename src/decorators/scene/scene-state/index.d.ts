import { SceneInterface } from '../'
import { Rect } from '../../../models'
import { FlexId } from '../../../types'
import { CameraConstructor } from '../../camera'
import { MeshConstructor } from '../../mesh'
import { ParticleConstructor } from '../../particle'
import { SpriteConstructor } from '../../sprite'

export declare abstract class SceneStateInterface<S = any, C = SceneInterface> {
  /**
   * Owner scene of this state.
   */
  get scene(): C

  /**
   * Initial setup of the state.
   */
  get setup(): S

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Sets a camera.
   */
  setCamera<C extends CameraConstructor>(camera: C, setup: InstanceType<C>['setup']): void

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
