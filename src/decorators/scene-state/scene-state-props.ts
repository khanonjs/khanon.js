import { CameraConstructor } from '../../constructors/camera-constructor'
import { UseCamera } from '../../models'

export interface SceneStateProps {
  /**
   * Camera to be used at state start in function of 'useCamera' property.
   */
  camera: CameraConstructor

  /**
   * Tells how to use the camera on state start.
   */
  useCamera: UseCamera
}
