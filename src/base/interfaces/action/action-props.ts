import { MeshConstructor } from '../../../decorators/mesh/mesh-constructor'
import { ParticleConstructor } from '../../../decorators/particle/particle-constructor'
import { SpriteConstructor } from '../../../decorators/sprite/sprite-constructor'

export interface ActionProps<O> {
  group?: number
  preserve?: boolean
  overrides?: O[]
  countFrames?: number
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  particles?: ParticleConstructor[]
}
