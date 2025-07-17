import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { SpriteConstructor } from '../sprite/sprite-constructor'

export interface ParticleProps {
  sprites?: SpriteConstructor[]
  position: Vector3
  capacity: number
  renderingGroupId?: number
  renderOverScene: boolean
}
