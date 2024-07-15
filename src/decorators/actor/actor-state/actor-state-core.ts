import { Spawnable } from '../../../base'
import { ActorInterface } from '../actor-interface'
import { ActorStateInterface } from './actor-state-interface'
import { ActorStateProps } from './actor-state-props'

export abstract class ActorStateCore implements Spawnable<ActorStateInterface> {
  abstract props: ActorStateProps
  abstract Instance: ActorStateInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(actor: ActorInterface): ActorStateInterface
}
