import { ParticleSourceCore } from './particle-source-core'
import { ParticleSourceProps } from './particle-source-props'

export function ParticleSource(props: ParticleSourceProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & ParticleSourceCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements ParticleSourceCore {
      props = props
    }
    return _class
  }
}
