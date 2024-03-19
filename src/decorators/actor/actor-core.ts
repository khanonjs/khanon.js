import { ActorConstructor } from '../../constructors'
import { LoadingProgress } from '../../models'
import { ActorProps } from './actor-props'

export abstract class ActorCore {
  abstract props: ActorProps
  abstract Interface: ActorConstructor // Disambiguate core global methods from interface spawnable instances
  abstract load(): LoadingProgress
  abstract unload(): void
}
