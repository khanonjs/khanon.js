import { CameraCore } from './camera-core'
import { CameraProps } from './camera-props'

export function Camera(props: CameraProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & CameraCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements CameraCore {
      props = props
    }
    return _class
  }
}
