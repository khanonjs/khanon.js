import { CameraCore } from './camera-core'
import { CameraProps } from './camera-props'
import { CameraType } from './camera-type'

export function Camera(props: CameraProps): any {
  return function <T extends { new (...args: any[]): CameraType }>(constructor: T & CameraType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements CameraCore {
      props = props
    }
    return _class
  }
}
