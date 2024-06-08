import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneType } from '../scene/scene-type'
import { ActorInterface } from './actor-interface'
import { ActorProps } from './actor-props'

export abstract class ActorCore implements Loadable<SceneType>, Spawnable<ActorInterface> {
  abstract props: ActorProps
  abstract Instance: ActorInterface // Disambiguate core methods from interface spawnable instances
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(): void
  abstract spawn(): void
}
