import * as BABYLON from '@babylonjs/core'

import { ExtractOptional } from '../../types/extract-optional'
import { ParticleProps } from './particle-props'

export interface ParticlePropsDefault extends ExtractOptional<ParticleProps> {
  capacity: number
  offset: BABYLON.Vector3
}

export const particlePropsDefault: ParticlePropsDefault = {
  capacity: 2000,
  offset: new BABYLON.Vector3(0, 0, 0)
}
