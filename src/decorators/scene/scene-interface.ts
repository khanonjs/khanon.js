import { ActorConstructor } from '../actor/actor-constructor'
import { ParticleSourceConstructor } from '../particle-source/particle-source-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { StateConstructor } from '../state/state-constructor'

export declare abstract class SceneInterface {
  start(): void
  stop(): void
  load(): void
  unload(): void
  setState(state: StateConstructor): void
  spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void
  applyConfiguration(): void

  protected onLoad?(): void
  protected onUnload?(): void
  protected onStart?(): void
  protected onStop?(): void
}
