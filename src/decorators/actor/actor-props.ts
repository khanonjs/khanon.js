import { MeshConstructor } from '../mesh/mesh-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { ActorActionConstructor } from './actor-action/actor-action-constructor'
import { ActorStateConstructor } from './actor-state/actor-state-constructor'

export interface ActorProps {
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  // guis?: GUIConstructor[]
  states?: ActorStateConstructor[]
  actions?: ActorActionConstructor[]
  particles?: ParticleConstructor[]
}
