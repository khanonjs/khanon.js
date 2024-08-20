import { Spawnable } from '../../base'
import { ParticleInterface } from './particle-interface'
import { ParticleProps } from './particle-props'

export abstract class ParticleCore implements Spawnable<ParticleInterface> {
  props: ParticleProps
  abstract Instance: ParticleInterface
  abstract spawn(container?: any): void
}
