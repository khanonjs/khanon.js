import { Camera as BabylonCamera } from '@babylonjs/core'

import { CameraConstructor } from '../../constructors'
import { CamerasController } from '../../controllers'
import { BabylonAccessor } from '../../models'
import { SceneType } from '../scene/scene-type'
import { CameraCore } from './camera-core'
import { CameraInterface } from './camera-interface'

export function Camera(): any {
  return function <T extends { new (...args: any[]): CameraInterface }>(constructor: T & CameraInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements CameraInterface {
      babylon: Pick<BabylonAccessor<BabylonCamera>, 'camera'> = { camera: null }
    }
    const _classCore = class implements CameraCore {
      Instance: CameraConstructor = _classInterface
      InstanceReference: CameraInterface = new _classInterface()

      spawn(): CameraInterface {
        const camera = new this.Instance()
        return camera
      }
    }
    CamerasController.register(new _classCore())
    return CameraInterface
  }
}
