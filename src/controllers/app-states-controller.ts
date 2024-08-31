import { ControllerLoader } from '../base'
import { AppStateConstructor } from '../decorators/app/app-state/app-state-constructor'
import { AppStateCore } from '../decorators/app/app-state/app-state-core'

export class AppStatesController extends ControllerLoader<AppStateConstructor, AppStateCore>() {
}
