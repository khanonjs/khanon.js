import { BaseController } from '../base/base-controller'
import { SceneType } from '../decorators/scene/scene-type'
import { Logger } from '../modules/logger/logger'

export class ScenesController extends BaseController<SceneType>() {
  static load(constructors: SceneType | SceneType[]) {
    if (Array.isArray(constructors)) {
      constructors.forEach(constructor => ScenesController.get(constructor).load())
    } else {
      ScenesController.get(constructors).load()
    }
  }

  static unload(constructors: SceneType | SceneType[]) {
    if (Array.isArray(constructors)) {
      constructors.forEach(constructor => ScenesController.get(constructor).unload())
    } else {
      ScenesController.get(constructors).unload()
    }
  }
}
