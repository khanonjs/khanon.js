import {
  Loadable,
  LoadingProgress
} from '../../base'
import { ActorConstructor } from '../../constructors/actor-constructor'
import { ParticleConstructor } from '../../constructors/particle-constructor'
import { ParticleSourceConstructor } from '../../constructors/particle-source-constructor'
import { SceneStateConstructor } from '../../constructors/state-constructor'
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
  abstract spawnActor(actor: ActorConstructor, onSpawn?: (item: ActorConstructor) => void): void
  abstract spawnParticle(particle: ParticleConstructor, onSpawn?: (particle: ParticleConstructor) => void): void
  abstract spawnParticleSource(particleSource: ParticleSourceConstructor, onSpawn?: (particleSource: ParticleSourceConstructor) => void): void
  onStart?(): void
  onStop?(): void
  onLoaded?(): void
  onUnload?(): void
}
