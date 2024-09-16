import { ActorConstructor } from '../../actor/actor-constructor'
import { MeshConstructor } from '../../mesh/mesh-constructor'
import { ParticleConstructor } from '../../particle/particle-constructor'
import { SpriteConstructor } from '../../sprite/sprite-constructor'

export interface SceneStateProps {
  actors?: ActorConstructor[]
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  particles?: ParticleConstructor[]
}
