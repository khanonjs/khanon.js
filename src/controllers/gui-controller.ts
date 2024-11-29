import { ControllerLoader } from '../base'
import { GUIConstructor } from '../decorators/gui/gui-constructor'
import { GUICore } from '../decorators/gui/gui-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class GUIController extends ControllerLoader<GUIConstructor, GUICore, SceneInterface | null>() {
}
