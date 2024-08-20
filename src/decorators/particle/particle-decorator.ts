import { ParticleCore } from './particle-core'
import { ParticleProps } from './particle-props'

export function Particle(props: ParticleProps): any {
  return function <T extends { new (...args: any[])/*: ParticleType */ }>(constructor: T /* & ParticleType */, context: ClassDecoratorContext) {
    const _class = class extends constructor /* implements ParticleCore */ {
      props = props
    }
    return _class
  }
}
