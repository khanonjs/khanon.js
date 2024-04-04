import { ParticleSourceCore } from './particle-source-core'
import { ParticleSourceInterface } from './particle-source-interface'
import { ParticleSourceProps } from './particle-source-props'
import { ParticleSourceType } from './particle-source-type'

export function ParticleSource(props: ParticleSourceProps): any {
  return function <T extends { new (...args: any[]): ParticleSourceType }>(constructor: T & ParticleSourceType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements ParticleSourceCore {
      props = props
    }
    return _class
  }
}
