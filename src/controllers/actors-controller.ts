import { ControllerLoader } from '../base'
import { ActorConstructor } from '../decorators/actor/actor-constructor'
import { ActorCore } from '../decorators/actor/actor-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class ActorsController extends ControllerLoader<ActorConstructor, ActorCore, SceneInterface>() {

}
