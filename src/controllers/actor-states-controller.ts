import { ControllerLoader } from '../base'
import { ActorStateConstructor } from '../decorators/actor/actor-state/actor-state-constructor'
import { ActorStateCore } from '../decorators/actor/actor-state/actor-state-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class ActorStatesController extends ControllerLoader<ActorStateConstructor, ActorStateCore, SceneInterface>() {
}
