import { MotionCore } from './motion-core'
import { MotionProps } from './motion-props'

export function Motion(props: MotionProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & MotionCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements MotionCore {
      props = props
    }
    return _class
  }
}
