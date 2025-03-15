import { ParticleConstructor } from '../../../decorators/particle/particle-constructor'
import { ParticleInterface } from '../../../decorators/particle/particle-interface'

export interface MetadataParticleDefinition {
  propertyName: string
  classDefinition: ParticleConstructor
  method: ParticleInterface
}
