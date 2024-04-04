import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { ActorConstructor } from '../../constructors'
import { SceneType } from '../scene/scene-type'
import { ActorProps } from './actor-props'

export abstract class ActorCore implements Loadable<SceneType>, Spawnable<ActorConstructor> {
  abstract props: ActorProps
  abstract Instance: ActorConstructor // Disambiguate core methods from interface spawnable instances
  abstract load(scene: SceneType): LoadingProgress
  abstract unload(): void
  abstract spawn(): void
}
