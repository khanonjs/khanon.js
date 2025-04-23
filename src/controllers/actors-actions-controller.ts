import { ControllerLoader } from '../base'
import { ActorActionConstructor } from '../decorators/actor/actor-action/actor-action-constructor'
import { ActorActionCore } from '../decorators/actor/actor-action/actor-action-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class ActorActionsController extends ControllerLoader<ActorActionConstructor, ActorActionCore, SceneInterface>() {}
