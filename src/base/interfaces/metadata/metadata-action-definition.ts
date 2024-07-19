import { ActorActionConstructor } from '../../../constructors/actor-action-constructor'
import { SceneActionConstructor } from '../../../constructors/scene-action-constructor'

export interface MetadataActionDefinition<C /* extends ActorActionConstructor | SceneActionConstructor */> { // 8a8f
  methodName: string
  classDefinition: C
}
