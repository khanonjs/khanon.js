import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteInterface } from './sprite-interface'
import { SpriteParticleData } from './sprite-particle-data'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'
import { SpritePropsDefault } from './sprite.props.deafult'

export abstract class SpriteCore implements Loadable<SceneInterface>, Spawnable<SpriteInterface> {
  abstract props: SpriteProps & SpritePropsDefault
  abstract Instance: SpriteInterface
  abstract textures: Map<SceneInterface, SpriteTexture>
  abstract load(scene: SceneInterface): LoadingProgress
  abstract unload(scene: SceneInterface): void
  abstract spawn(scene: SceneInterface): SpriteInterface
  abstract getParticleData(scene: SceneInterface): SpriteParticleData
}
