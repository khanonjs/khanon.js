import { CameraConstructor } from '../../constructors'

export interface StateProps {
  camera: CameraConstructor // 8a8f sure we want to set a new camera per state? SceneState vs ActorState?
}
