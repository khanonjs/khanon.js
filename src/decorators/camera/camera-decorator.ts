import { BabylonAccessor } from '../../models'
import { CameraCore } from './camera-core'
import { CameraInterface } from './camera-interface'
import { CameraProps } from './camera-props'
import { CameraType } from './camera-type'

export function Camera(props: CameraProps): any {
  return function <T extends { new (...args: any[]): CameraType }>(constructor: T & CameraType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements CameraCore, CameraInterface {
      props = props
      babylon: Pick<BabylonAccessor<ReturnType<this['initialize']>>, 'camera'> = { camera: null }
    }
    return _class
  }
}
