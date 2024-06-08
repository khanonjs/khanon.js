import { Spawnable } from '../../base'
import { CameraInterface } from './camera-interface'

export abstract class CameraCore implements Spawnable<CameraInterface> {
  abstract Instance: CameraInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(): CameraInterface
}
