import { MeshConstructor } from '../../../decorators/mesh/mesh-constructor'
import { ParticleConstructor } from '../../../decorators/particle/particle-constructor'
import { SpriteConstructor } from '../../../decorators/sprite/sprite-constructor'
import { FlexId } from '../../../types/flex-id'

export interface ActionProps<O> {
  group?: FlexId
  preserve?: boolean
  overrides?: (O | string)[]
  countFrames?: number
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  particles?: ParticleConstructor[]
}
