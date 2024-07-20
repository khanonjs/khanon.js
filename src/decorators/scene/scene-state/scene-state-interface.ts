import { StateInterface } from '../../../base'
import { CameraConstructor } from '../../../constructors/camera-constructor'
import { SceneInterface } from '../scene-interface'
import { SceneMetadata } from '../scene-metadata'

export abstract class SceneStateInterface<S = any, C = SceneInterface> extends StateInterface<S> {
  abstract metadata?: SceneMetadata

  /**
   * User available
   */
  abstract scene: C
  abstract setCamera(camera: CameraConstructor): void
}
