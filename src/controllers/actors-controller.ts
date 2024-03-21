import { ControllerLoadable } from '../base'
import { ActorConstructor } from '../constructors'
import { ActorType } from '../decorators/actor/actor-type'

export class ActorsController extends ControllerLoadable<ActorConstructor, ActorType>() {

}
