import { ControllerLoader } from '../base'
import { InputEventsProfileConstructor } from '../decorators/input-events-profile/input-events-profile-constructor'
import { InputEventsProfileInterface } from '../decorators/input-events-profile/input-events-profile-interface'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class InputEventsProfileController extends ControllerLoader<InputEventsProfileConstructor, InputEventsProfileInterface, SceneInterface>(true) {} // 8a8f
