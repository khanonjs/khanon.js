import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { ExtractOptional } from '../../types/extract-optional'
import { ParticleProps } from './particle-props'

export interface ParticlePropsDefault extends ExtractOptional<ParticleProps> {
  capacity: number
  position: Vector3
}

export const particlePropsDefault: ParticlePropsDefault = {
  capacity: 2000,
  position: new Vector3(0, 0, 0)
}
