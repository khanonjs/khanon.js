import { ActorConstructor } from '../constructors'

export class ActorsController {
  static actors: ActorConstructor[] = []

  static register(actor: ActorConstructor) {
    ActorsController.actors.push(actor)
  }

  static get(constructor: ActorConstructor): ActorConstructor {
    return ActorsController.actors.find(actor => actor instanceof (constructor as ActorConstructor))
  }
}
