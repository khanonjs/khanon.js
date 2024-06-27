// 8a8f DEPRECATED???? or adds here Meshes and Sprites by decorators?

import { SceneType } from '../scene/scene-type'

export class ActorMetadata {
  compositions: Map<string, (scene: SceneType) => void> = new Map<string, (scene: SceneType) => void>()
}
