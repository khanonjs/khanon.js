import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneType } from '../scene/scene-type'
import { MeshInstance } from './mesh-instance'
import { MeshProps } from './mesh-props'

export abstract class MeshCore implements Loadable<SceneType>, Spawnable<MeshInstance> {
  abstract props: MeshProps
  abstract Instance: MeshInstance
  // abstract textures: Map<SceneType, SpriteTexture>
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(scene: SceneType): void
  abstract spawn(): MeshInstance
}
