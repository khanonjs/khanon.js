import { Loadable } from '../../base'
import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'
import { LoadingProgress } from '../../models'
import { BabylonContainer } from '../../models/babylon-container'

export abstract class SceneInterface implements Loadable {
  babylon: Pick<BabylonContainer, 'engine' | 'scene'>
  loaded: boolean
  started: boolean
  abstract start(state: StateConstructor): void
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract setState(state: StateConstructor): void
  abstract spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void
  onStart?(): void
  onStop?(): void
  onLoad?(progress: LoadingProgress): void
  onUnload?(): void
  onError?(errorMsg: string): void
}
