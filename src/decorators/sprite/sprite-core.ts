import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneType } from '../scene/scene-type'
import { SpriteInstance } from './sprite-instance'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'

export abstract class SpriteCore implements Loadable<SceneType>, Spawnable<() => SpriteInstance> {
  abstract props: SpriteProps
  abstract loaded: boolean
  abstract texture: SpriteTexture
  abstract Instance: () => SpriteInstance // Disambiguate core methods from interface spawnable instances
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(): void
  abstract spawn(): void
}
