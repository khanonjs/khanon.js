import { MeshConstructor } from '../mesh/mesh-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { GUIStateConstructor } from './gui-state/gui-state-constructor'

export interface GUIProps {
  states?: GUIStateConstructor[]
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  particles?: ParticleConstructor[]
}
