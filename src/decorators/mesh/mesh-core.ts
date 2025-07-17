import { AssetContainer } from '@babylonjs/core/assetContainer'

import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { MeshInterface } from './mesh-interface'
import { MeshProps } from './mesh-props'

export abstract class MeshCore implements Loadable<SceneInterface>, Spawnable<MeshInterface> {
  abstract props: MeshProps
  abstract Instance: MeshInterface
  abstract assetContainers: Map<SceneInterface, AssetContainer>
  abstract _load(scene: SceneInterface): LoadingProgress
  abstract _unload(scene: SceneInterface): void
  abstract spawn(scene: SceneInterface): MeshInterface
  abstract getClassName(): string
}
