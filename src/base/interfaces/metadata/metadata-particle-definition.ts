import { ParticleConstructor } from '../../../decorators/particle/particle-constructor'

export interface MetadataParticleDefinition {
  propertyName: string
  classDefinition: ParticleConstructor
  methodName: string
}
