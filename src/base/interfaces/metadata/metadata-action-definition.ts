import { ActorActionConstructor } from '../../../constructors/actor-action-constructor'
import { SceneActionConstructor } from '../../../constructors/scene-action-constructor'

export interface MetadataActionDefinition<C extends ActorActionConstructor | SceneActionConstructor> {
  methodName: string
  classDefinition: C
}
