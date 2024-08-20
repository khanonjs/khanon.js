import * as BABYLON from '@babylonjs/core'

import { SpriteConstructor } from '../sprite/sprite-constructor'

export interface ParticleProps {
  sprites: SpriteConstructor[]
  position: BABYLON.Vector3 | BABYLON.Mesh | BABYLON.AbstractMesh
  number?: number
  capacity?: number
}
