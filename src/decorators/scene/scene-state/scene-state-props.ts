import { MeshConstructor } from '../../mesh/mesh-constructor'
import { ParticleConstructor } from '../../particle/particle-constructor'
import { SpriteConstructor } from '../../sprite/sprite-constructor'

export interface SceneStateProps {
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  particles?: ParticleConstructor[]
}
