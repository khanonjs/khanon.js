import { ActorInterface } from '../decorators/actor/actor-interface'
import { Logger } from '../modules'

export class ActorCompositionsController {
  static compositions: Map<ActorInterface, { id: string, method: () => any }[]> = new Map<ActorInterface, { id: string, method: () => any }[]>()

  static set(actor: ActorInterface, id: string, method: () => any) {
    Logger.trace('aki ActorCompositionsController set A', actor)
    Logger.trace('aki ActorCompositionsController set B', id)
    const array = this.compositions.get(actor) ?? []
    array.push({ id, method })
  }

  static get(actor: ActorInterface, id: string) {
    Logger.trace('aki ActorCompositionsController get A', actor)
    Logger.trace('aki ActorCompositionsController get B', id)
    Logger.trace('aki ActorCompositionsController get C', this.compositions)
    Logger.trace('aki ActorCompositionsController get D', this.compositions.get(actor))
    this.compositions.get(actor).find(composition => composition.id === id)
  }
}
