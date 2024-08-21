import { ExtractOptional } from '../../types'
import { ParticleProps } from './particle-props'

export interface ParticlePropsDefault extends ExtractOptional<ParticleProps> {
  capacity: number
}

export const particlePropsDefault: ParticlePropsDefault = {
  capacity: 2000
}
