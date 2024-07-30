import { StateProps } from '../../../base'
import { UseCamera } from '../../../models/use-camera'
import { CameraConstructor } from '../../camera/camera-constructor'

export interface SceneStateProps extends StateProps {
  /**
   * Camera to be used at state start in function of 'useCamera' property.
   */
  camera: CameraConstructor

  /**
   * Tells how to use the camera on state start.
   */
  useCamera: UseCamera
}
