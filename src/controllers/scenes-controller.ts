import { SceneConstructor } from '../constructors'
import { SceneType } from '../decorators/scene/scene-type'
import { Logger } from '../modules/logger/logger'

export class SceneController {
  static scenes: SceneType[] = []

  static registerScene(scene: SceneType) {
    SceneController.scenes.push(scene)
  }

  static load(constructors: SceneConstructor | SceneConstructor[]) {
    if (Array.isArray(constructors)) {
      constructors.forEach(constructor => SceneController.getScene(constructor).load())
    } else {
      SceneController.getScene(constructors).load()
    }
  }

  static unload(constructors: SceneConstructor | SceneConstructor[]) {
    if (Array.isArray(constructors)) {
      constructors.forEach(constructor => SceneController.getScene(constructor).unload())
    } else {
      SceneController.getScene(constructors).unload()
    }
  }

  static getScene(constructor: SceneConstructor): SceneType {
    return SceneController.scenes.find(scene => scene instanceof (constructor as SceneConstructor))
  }
}
