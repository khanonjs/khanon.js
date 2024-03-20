import { Controller } from '../base'
import { ActorConstructor } from '../constructors'
import { ActorType } from '../decorators/actor/actor-type'

export class ActorsController extends Controller<ActorType>() {
  static load(constructors: ActorConstructor | ActorConstructor[]) {
    if (Array.isArray(constructors)) {
      ActorsController.get(constructors).forEach(actor => actor.load())
    } else {
      ActorsController.get(constructors).load()
    }
  }

  static unload(constructors: ActorConstructor | ActorConstructor[]) {
    if (Array.isArray(constructors)) {
      ActorsController.get(constructors).forEach(actor => actor.unload())
    } else {
      ActorsController.get(constructors).unload()
    }
  }
}
