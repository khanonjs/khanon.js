import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { ActorInterface } from './actor-interface'
import { ActorProps } from './actor-props'

export abstract class ActorCore implements Loadable<SceneInterface>, Spawnable<ActorInterface> {
  abstract props: ActorProps
  abstract Instance: ActorInterface // Disambiguate core methods from interface spawnable instances
  abstract load(scene: SceneInterface): LoadingProgress
  abstract unload(): void
  abstract spawn(scene: SceneInterface): ActorInterface
}
