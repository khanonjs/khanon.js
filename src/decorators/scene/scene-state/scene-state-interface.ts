import {
  CanvasResizable,
  LoopUpdatable,
  StateInterface
} from '../../../base'
import { CameraConstructor } from '../../../constructors/camera-constructor'
import { SceneInterface } from '../scene-interface'

export abstract class SceneStateInterface<S = any> extends StateInterface<S> {
  /**
   * User available
   */
  abstract scene: SceneInterface
  abstract setCamera(camera: CameraConstructor): void
}
