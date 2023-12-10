import { ActorsController } from '../../controllers/actors-controller'
import { ActorConstructor } from '../actor/actor-constructor'
import { ParticleSourceConstructor } from '../particle-source/particle-source-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { StateConstructor } from '../state/state-constructor'

export interface SceneInterface {
  // Properties
  camera: void
  actors: ActorsController

  // Methods
  setState(state: StateConstructor): void
  spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void

  // Callbacks
  onLoad(): void
  onUnload(): void
  onStart(): void
  onStop(): void
}
