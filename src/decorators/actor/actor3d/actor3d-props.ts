import { MeshConstructor } from '../../../constructors'
import { ActorProps } from '../actor-props'

export interface Actor3DProps extends ActorProps {
  meshes: MeshConstructor[]
}
