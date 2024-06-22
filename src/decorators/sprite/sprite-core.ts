import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from './sprite-interface'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'
import { SpritePropsDefault } from './sprite.props.deafult'

export abstract class SpriteCore implements Loadable<SceneType>, Spawnable<SpriteInterface> {
  abstract props: SpriteProps & SpritePropsDefault
  abstract Instance: SpriteInterface
  abstract textures: Map<SceneType, SpriteTexture>
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(scene: SceneType): void
  abstract spawn(scene: SceneType): SpriteInterface
}
