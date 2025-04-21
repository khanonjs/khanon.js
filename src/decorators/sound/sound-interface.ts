import { Loadable } from '../../base'
import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import { ActorInterface } from '../actor/actor-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SoundProps } from './sound-props'

export abstract class SoundInterface implements Loadable<SceneInterface | ActorInterface> {
  abstract props: SoundProps
  abstract _load(source: SceneInterface | ActorInterface): LoadingProgress
  abstract _unload(): void
  abstract getClassName(): string
}
