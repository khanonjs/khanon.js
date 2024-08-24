import { MotionCore } from './motion-core'
import { MotionProps } from './motion-props'
import { MotionType } from './motion-type'

export function Motion(props: MotionProps): any {
  return function <T extends { new (...args: any[]): MotionType }>(constructor: T & MotionType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements MotionCore {
      props = props
    }
    return _class
  }
}
