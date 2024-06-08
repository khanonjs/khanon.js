import { Spawnable } from '../../base'
import { CameraConstructor } from '../../constructors'
import { CameraInterface } from './camera-interface'

export abstract class CameraCore implements Spawnable<CameraConstructor, CameraInterface> {
  abstract Instance: CameraConstructor // Disambiguate core methods from interface spawnable instances
  abstract InstanceReference: CameraInterface
  abstract spawn(): CameraInterface
}
