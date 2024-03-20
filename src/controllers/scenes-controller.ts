import { Controller } from '../base'
import { SceneType } from '../decorators/scene/scene-type'
import { Logger } from '../modules/logger/logger'

export class ScenesController extends Controller<SceneType>() {
  static load(constructors: SceneType | SceneType[]) {
    if (Array.isArray(constructors)) {
      ScenesController.get(constructors).forEach(actor => actor.load())
    } else {
      ScenesController.get(constructors).load()
    }
  }

  static unload(constructors: SceneType | SceneType[]) {
    if (Array.isArray(constructors)) {
      ScenesController.get(constructors).forEach(actor => actor.unload())
    } else {
      ScenesController.get(constructors).unload()
    }
  }
}
