import {
  MeshConstructor,
  SpriteConstructor
} from '../../../constructors'
import { ActorProps } from '../actor-props'

export interface Actor3DProps extends ActorProps {
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
}
