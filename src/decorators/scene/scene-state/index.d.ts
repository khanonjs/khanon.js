import {
  SceneInterface,
  SceneRemove,
  SceneSpawn
} from '../'
import {
  BabylonAccessor,
  Rect,
  Timeout
} from '../../../models'
import { FlexId } from '../../../types'
import { ActorConstructor } from '../../actor'
import {
  CameraConstructor,
  CameraInterface
} from '../../camera'
import {
  GUIConstructor,
  GUIInterface
} from '../../gui'
import { MeshConstructor } from '../../mesh'
import { ParticleConstructor } from '../../particle'
import { SpriteConstructor } from '../../sprite'

export declare abstract class SceneStateInterface<S = any, C = SceneInterface> {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene'>

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
   * Sets a timeout.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setTimeout(func: () => void, ms: number): Timeout

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
   * Shows a GUI. This GUI must have been declared in the decorator props.
   * @param gui
   * @param setup
   */
  showGUI<G extends GUIInterface, H extends GUIConstructor>(gui: H, setup: InstanceType<H>['setup']): G

  /**
   * Hides a GUI.
   * @param gui
   */
  hideGUI(gui: GUIConstructor): void

  /**
   * Gets a GUI that's being shown.
   * @param gui
   */
  getGUI<G extends GUIInterface>(gui: GUIConstructor): G | undefined

  /**
   * Sets a camera.
   */
  switchCamera<C extends CameraConstructor>(camera: C, setup: InstanceType<C>['setup']): void

  /**
   * Gets the camera. Use the generic 'C' to set the returning camera type.
   */
  getCamera<C extends CameraInterface = CameraInterface>(): C

  /**
   * Set the state.
   * @param state
   */
  switchState<C extends new () => SceneStateInterface>(state: C, setup: InstanceType<C>['setup']): void // IMPROVE is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Notifies a message to this state.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Invoked on state start. Use this method to setup the scene according to this state start.
   */
  onStart?(): void

  /**
   * Invoked on state end. Use this method to setup the scene according to the state end.
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
