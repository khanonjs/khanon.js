import {
  Loadable,
  Spawnable
} from '../../base'
import { SpriteConstructor } from '../../constructors'
import { LoadingProgress } from '../../models'
import { SceneType } from '../scene/scene-type'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'

export abstract class SpriteCore implements Loadable<SceneType>, Spawnable<SpriteConstructor> {
  abstract props: SpriteProps
  abstract loaded: boolean
  abstract texture: SpriteTexture
  abstract Instance: SpriteConstructor // Disambiguate core methods from interface spawnable instances
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(): void
  abstract spawn(): void
}
