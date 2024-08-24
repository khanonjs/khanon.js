import { ControllerLoader } from '../base'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SceneStateConstructor } from '../decorators/scene/scene-state/scene-state-constructor'
import { SceneStateCore } from '../decorators/scene/scene-state/scene-state-core'

export class SceneStatesController extends ControllerLoader<SceneStateConstructor, SceneStateCore, SceneInterface>() {
}
