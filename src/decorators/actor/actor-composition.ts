import { MeshType } from '../mesh/mesh-type'
import { SpriteType } from '../sprite/sprite-type'

export interface ActorComposition {
  id: string
  sprites?: SpriteType[]
  meshes?: MeshType[]
}
