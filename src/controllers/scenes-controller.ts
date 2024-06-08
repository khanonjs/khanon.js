import { ControllerLoader } from '../base'
import {
  SceneConstructor,
  SceneStateConstructor
} from '../constructors'
import { SceneType } from '../decorators/scene/scene-type'

export class ScenesController extends ControllerLoader<SceneType, SceneType>() {
  static start(scene: SceneConstructor, state: SceneStateConstructor): void {
    ScenesController.get(scene).start(state)
  }

  static stop(scene: SceneConstructor): void {
    ScenesController.get(scene).stop()
  }

  static setState(scene: SceneConstructor, state: SceneStateConstructor): void {
    ScenesController.get(scene).setState(state)
  }
}
