import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { CameraConstructor } from '../../camera/camera-constructor'
import { SceneInterface } from '../scene-interface'

export abstract class SceneStateInterface<S = any, C = SceneInterface> extends StateInterface<S> {
  abstract metadata?: Metadata

  /**
   * User available
   */
  abstract scene: C
  abstract setCamera(camera: CameraConstructor): void
}
