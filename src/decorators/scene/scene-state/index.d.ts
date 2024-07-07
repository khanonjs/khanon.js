import { CameraConstructor } from '../../../constructors/camera-constructor'
import { Rect } from '../../../models'
import { SceneType } from '../scene-type'
import { SceneStateProps } from './scene-state-props'

export { SceneStateProps } from './decorators/scene-state/scene-state-props'
export declare function SceneState(props: SceneStateProps): any
export declare abstract class SceneStateInterface {
  /**
   * Owner scene of this state
   */
  get scene(): SceneType

  /**
   * Turns ON/OFF 'onLoopUpdate' callback
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Sets a camera. Use this method at any point or event of the state lifecycle.
   */
  setCamera(camera: CameraConstructor): void

  /**
   * Invoked on state start. Use this method to setup the scene according to this state start.
   */
  onStart?(scene: SceneType): void

  /**
   * Invoked on state end. Use this method to setup the scene according to this state end.
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
