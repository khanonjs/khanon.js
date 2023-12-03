import { SceneCore } from './scene-core'
import { SceneProps } from './scene-props'

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SceneCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore {
      props = props
    }
    // const scene = new _class()
    return _class
  }
}
