import { Spawnable } from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { CameraInterface } from './camera-interface'

export abstract class CameraCore implements Spawnable<CameraInterface> {
  abstract Instance: CameraInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(scene: SceneInterface): CameraInterface
}
