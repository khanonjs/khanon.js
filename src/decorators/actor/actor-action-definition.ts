import { ActorActionConstructor } from '../../constructors/actor-action-constructor'

export interface ActorActionDefinition {
  methodName: string
  classDefinition: ActorActionConstructor
}
