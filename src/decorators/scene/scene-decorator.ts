import { ActorConstructor } from '../actor/actor-constructor'
import { ParticleSourceConstructor } from '../particle-source/particle-source-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { StateConstructor } from '../state/state-constructor'
import { SceneCore } from './scene-core'
import { SceneProps } from './scene-props'

// 8a8f can those methods be added to index.d.ts decorator declaration?
// Should be they added to scene-interface in declaration file?
// Should the methods be added to the function return as a type?

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SceneCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore {
      props = props

      setState(state: StateConstructor): void {

      }

      spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void {

      }

      applyConfiguration(): void {

      }
    }
    // const scene = new _class()
    return _class
  }
}
