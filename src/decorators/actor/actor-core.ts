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
  abstract _load(scene: SceneInterface): LoadingProgress
  abstract _unload(scene: SceneInterface): void
  abstract spawn(scene: SceneInterface): ActorInterface
  abstract getClassName(): string
}
