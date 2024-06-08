import {
  Loadable,
  LoadingProgress
} from '../../base'
import { SceneType } from '../scene/scene-type'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'
import { SpritePropsDefault } from './sprite.props.deafult'

export abstract class SpriteCore implements Loadable<SceneType> {
  abstract props: SpriteProps & SpritePropsDefault
  abstract textures: Map<SceneType, SpriteTexture>
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(scene: SceneType): void
}
