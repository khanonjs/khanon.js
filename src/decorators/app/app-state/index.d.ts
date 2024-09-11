import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types'
import { GUIConstructor } from '../../gui'
import { SceneConstructor } from '../../scene'

// 8a8f

/**
 * Defines the state of the application.
 * @param A Actor owner of hte state (optional).
 * @param S Setup interface (optional).
 */
export declare abstract class AppStateInterface<S = any> {
  /**
   * Setup of the state.
   */
  get setup(): S

  /**
   * Turns on/off the 'onLoopUpdate' callback.
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

export type AppStateConstructor = new () => AppStateInterface

export interface AppStateProps {
  /**
   * Scenes to load on state start.
   * The previous state won't end and the app won't switch to thjis state until it has been loaded loaded.
   * These Scenes will be automatically unloaded on state end in case they are not used in the next state.
   */
  scenes?: SceneConstructor[]

  /**
   * GUIs to load in this state.
   * The previous state won't end and the app won't switch to thjis state until it has been loaded loaded.
   * These GUIs will be automatically unloaded on state end in case they are not used in the next state.
   */
  guis?: GUIConstructor[]
}

export declare function AppState(props?: AppStateProps): any
