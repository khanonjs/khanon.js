import {
  Loadable,
  LoadingProgress
} from '../../base'
import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneStateConstructor
} from '../../constructors'
import { BabylonAccessor } from '../../models/babylon-accessor'

export abstract class SceneInterface implements Loadable {
  abstract babylon: Pick<BabylonAccessor, | 'scene'>
  abstract get loaded(): boolean
  abstract get started(): boolean
  abstract start(state: SceneStateConstructor): void
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract setState(state: SceneStateConstructor): void
  abstract spawnActor(actor: ActorConstructor, initialize?: (actor: ActorConstructor) => void): void
  abstract spawnParticle(particle: ParticleConstructor, initialize?: (particle: ParticleConstructor) => void): void
  abstract spawnParticleSource(particleSource: ParticleSourceConstructor, initialize?: (particleSource: ParticleSourceConstructor) => void): void
  onStart?(): void
  onStop?(): void
  onLoaded?(): void
  onUnload?(): void
}
