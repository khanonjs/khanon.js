import { ControllerLoader } from '../base'
import { CameraStateConstructor } from '../decorators/camera/camera-state/camera-state-constructor'
import { CameraStateCore } from '../decorators/camera/camera-state/camera-state-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class CameraStatesController extends ControllerLoader<CameraStateConstructor, CameraStateCore, SceneInterface>() {}
