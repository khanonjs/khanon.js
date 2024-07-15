import { ActorActionConstructor } from '../../constructors/actor-action-constructor'
import { ActorStateConstructor } from '../../constructors/actor-state-constructor'
import { GUIConstructor } from '../../constructors/gui-constructor'
import { MeshConstructor } from '../../constructors/mesh-constructor'
import { ParticleConstructor } from '../../constructors/particle-constructor'
import { ParticleSourceConstructor } from '../../constructors/particle-source-constructor'
import { SpriteConstructor } from '../../constructors/sprite-constructor'

export interface ActorProps {
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  guis?: GUIConstructor[]
  states?: ActorStateConstructor[]
  actions?: ActorActionConstructor[]
  particles?: (ParticleConstructor | ParticleSourceConstructor)[]
}
