import { SceneType } from '../scene/scene-type'
import { ActorCompositionDefinition } from './actor-composition/actor-composition-definition'

export class ActorMetadata {
  compositions: Map<string, (composition: ActorCompositionDefinition, scene: SceneType) => void> = new Map<string, (composition: ActorCompositionDefinition, scene: SceneType) => void>()
}
