import { Bone } from '@babylonjs/core/Bones/bone'

import { MeshInterface } from '../mesh/mesh-interface'
import { SpriteInterface } from '../sprite/sprite-interface'

export interface ActorNode<B extends SpriteInterface | MeshInterface> {
  element: B
  bone: Bone
}
