import { ControllerLoader } from '../base'
import { ActorConstructor } from '../constructors'
import { ActorType } from '../decorators/actor/actor-type'
import { SceneType } from '../decorators/scene/scene-type'

export class ActorsController extends ControllerLoader<ActorConstructor, ActorType, SceneType>() {

}
