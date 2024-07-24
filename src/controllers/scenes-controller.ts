import { ControllerLoader } from '../base'
import { SceneConstructor } from '../constructors/scene-constructor'
import { SceneStateConstructor } from '../constructors/scene-state-constructor'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SceneStateOptions } from '../decorators/scene/scene-state/scene-state-options'
import { Logger } from '../modules/logger'

export class ScenesController extends ControllerLoader<SceneInterface, SceneInterface>() {
  static start(scene: SceneConstructor, state: SceneStateConstructor): SceneStateOptions {
    const sceneInterface = ScenesController.get(scene)
    const stateInterface = sceneInterface.start(state)
    return new SceneStateOptions(stateInterface)
  }

  static stop(scene: SceneConstructor): void {
    ScenesController.get(scene).stop()
  }

  static setState(scene: SceneConstructor, state: SceneStateConstructor): void {
    ScenesController.get(scene).startState(state)
  }
}
