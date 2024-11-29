import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteInterface } from './sprite-interface'
import { SpriteMesh } from './sprite-mesh'
import { SpriteParticleInfo } from './sprite-particle-data'
import { SpriteProps } from './sprite-props'
import { SpritePropsDefault } from './sprite.props.deafult'

export abstract class SpriteCore implements Loadable<SceneInterface>, Spawnable<SpriteInterface> {
  abstract props: SpriteProps & SpritePropsDefault
  abstract Instance: SpriteInterface
  abstract spriteMeshes: Map<SceneInterface, SpriteMesh>
  abstract load(scene: SceneInterface): LoadingProgress
  abstract unload(scene: SceneInterface): void
  abstract spawn(scene: SceneInterface): SpriteInterface
  abstract getParticleInfo(scene: SceneInterface): SpriteParticleInfo
}
