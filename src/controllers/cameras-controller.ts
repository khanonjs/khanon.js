import { Controller } from '../base'
import { CameraConstructor } from '../decorators/camera/camera-constructor'
import { CameraCore } from '../decorators/camera/camera-core'

export class CamerasController extends Controller<CameraConstructor, CameraCore>() {
}
