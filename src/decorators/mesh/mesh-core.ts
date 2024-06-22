import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneType } from '../scene/scene-type'
import { MeshInterface } from './mesh-interface'
import { MeshProps } from './mesh-props'

export abstract class MeshCore implements Loadable<SceneType>, Spawnable<MeshInterface> {
  abstract props: MeshProps
  abstract Instance: MeshInterface
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(scene: SceneType): void
  abstract spawn(): MeshInterface
}
