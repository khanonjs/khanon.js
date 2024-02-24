import { SceneCore } from './scene-core'
import { SceneInterface } from './scene-interface'
import { SceneProps } from './scene-props'

// 8a8f can those methods be added to index.d.ts decorator declaration?
// Should be they added to scene-interface in declaration file?
// Should the methods be added to the function return as a type?

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SceneCore & SceneInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor {
      props = props // 8a8f can I remove the equality?

      start(): void {}
      stop(): void {}
      load(): void {}
      unload(): void {}

      /*setState(state: StateConstructor): void {

      }

      spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void {

      }*/
    }
    return _class
  }
}
