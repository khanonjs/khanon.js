import { ControllerLoader } from '../base'
import { GUIInterface } from '../decorators/gui/gui-interface'
import { GUIStateConstructor } from '../decorators/gui/gui-state/gui-state-constructor'
import { GUIStateCore } from '../decorators/gui/gui-state/gui-state-core'

export class GUIStatesController extends ControllerLoader<GUIStateConstructor, GUIStateCore, GUIInterface>() {
}
