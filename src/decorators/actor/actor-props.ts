import { GUIConstructor } from '../gui/gui-constructor'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { ActorActionConstructor } from './actor-action/actor-action-constructor'
import { ActorStateConstructor } from './actor-state/actor-state-constructor'

export interface ActorProps {
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  guis?: GUIConstructor[]
  states?: ActorStateConstructor[]
  actions?: ActorActionConstructor[]
  particles?: ParticleConstructor[]
  renderingGroupId?: number
  visibility?: number
  // spawnByReferenceId?: string // 8a8f on BabylonSceneMap: Spanwns the actor by scene reference (it will spawn the actor in the scene where the babylon scene reference is equivalent to this Id). Do this for meshes and sprites.
}
