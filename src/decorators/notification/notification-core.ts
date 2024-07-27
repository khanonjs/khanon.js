import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { MeshInterface } from './notification-interface'
import { MeshProps } from './notification-props'

export abstract class MeshCore implements Loadable<SceneInterface>, Spawnable<MeshInterface> {
  abstract props: MeshProps
  abstract Instance: MeshInterface
  abstract load(scene: SceneInterface): LoadingProgress
  abstract unload(scene: SceneInterface): void
  abstract spawn(scene: SceneInterface): MeshInterface
}
