import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../../base'
import { ActorInterface } from '../actor-interface'
import { ActorActionInterface } from './actor-action-interface'
import { ActorActionProps } from './actor-action-props'

export abstract class ActorActionCore implements Spawnable<ActorActionInterface> {
  abstract props: ActorActionProps
  abstract Instance: ActorActionInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(actor: ActorInterface, props: any): ActorActionInterface
}
