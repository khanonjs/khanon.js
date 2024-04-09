import {
  Loadable,
  LoadingProgress
} from '../../base'
import { ActorConstructor } from '../../constructors/actor-constructor'
import { ParticleConstructor } from '../../constructors/particle-constructor'
import { ParticleSourceConstructor } from '../../constructors/particle-source-constructor'
import { StateConstructor } from '../../constructors/state-constructor'
import { BabylonAccesor } from '../../models/babylon-accesor'

export abstract class SceneInterface implements Loadable {
  abstract babylon: Pick<BabylonAccesor, | 'scene'>
  abstract get loaded(): boolean
  abstract get started(): boolean
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
}
