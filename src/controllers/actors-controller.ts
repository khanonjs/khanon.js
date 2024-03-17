import { ActorConstructor } from '../constructors'

export class ActorsController {
  static actors: ActorConstructor[] = []

  static registerActor(actor: ActorConstructor) {
    ActorsController.actors.push(actor)
  }

  static getActor(constructor: ActorConstructor): ActorConstructor {
    return ActorsController.actors.find(actor => actor instanceof (constructor as ActorConstructor))
  }
}
