import { ControllerLoader } from '../base'
import { ActorConstructor } from '../constructors'
import { ActorCore } from '../decorators/actor/actor-core'
import { SceneType } from '../decorators/scene/scene-type'

export class ActorsController extends ControllerLoader<ActorConstructor, ActorCore, SceneType>() {

}
