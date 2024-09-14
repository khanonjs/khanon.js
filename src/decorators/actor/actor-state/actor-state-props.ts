import { MeshConstructor } from '../../mesh/mesh-constructor'
import { ParticleConstructor } from '../../particle/particle-constructor'
import { SpriteConstructor } from '../../sprite/sprite-constructor'

export interface ActorStateProps {
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  particles?: ParticleConstructor[]
}
