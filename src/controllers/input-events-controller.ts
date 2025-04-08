import { ControllerLoader } from '../base'
import { InputEventsConstructor } from '../decorators/input-events/input-events-constructor'
import { InputEventsInterface } from '../decorators/input-events/input-events-interface'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class InputEventsController extends ControllerLoader<InputEventsConstructor, InputEventsInterface, SceneInterface>(true) {} // 8a8f
