import { Motion } from '../motion/motion'
import { ParticleEndCriteria } from './particle-end-criteria'

export interface ParticleProperties {
    x?: number
    y?: number
    z?: number
    scale?: number
    alpha?: number
    motion?: Motion
    endCriteria?: ParticleEndCriteria
    endValue?: number
}
