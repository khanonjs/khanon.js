import { SceneType } from '../scene/scene-type'
import { ActorCompositionBuilder } from './actor-composition/actor-composition-builder'

export class ActorMetadata {
  compositions: Map<string, (composition: ActorCompositionBuilder, scene: SceneType) => void> = new Map<string, (composition: ActorCompositionBuilder, scene: SceneType) => void>()
}
