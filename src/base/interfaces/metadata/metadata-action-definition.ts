import { ActorActionConstructor } from '../../../decorators/actor/actor-action/actor-action-constructor'
import { SceneActionConstructor } from '../../../decorators/scene/scene-action/scene-action-constructor'

export interface MetadataActionDefinition<C extends ActorActionConstructor | SceneActionConstructor> {
  methodName: string
  classDefinition: C
}
