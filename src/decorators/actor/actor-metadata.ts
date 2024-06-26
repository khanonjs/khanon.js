import { SceneType } from '../scene/scene-type'

export class ActorMetadata {
  compositions: Map<string, (scene: SceneType) => void> = new Map<string, (scene: SceneType) => void>()
}
