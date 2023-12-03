import { MainCore } from './main-core'
import { MainProps } from './main-props'

export function Main(props: MainProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & MainCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements MainCore {
      props = props
    }
    // const main = new _class()
    return _class
  }
}
