import { ControllerLoader } from '../base'
import { SceneConstructor } from '../constructors/scene-constructor'
import { SceneStateConstructor } from '../constructors/scene-state-constructor'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { Logger } from '../modules/logger'

export class ScenesController extends ControllerLoader<SceneInterface, SceneInterface>() {
  static start(scene: SceneConstructor, state: SceneStateConstructor, stateSetup: any): void {
    const sceneInterface = ScenesController.get(scene)
    sceneInterface.start(state, stateSetup)
  }

  static stop(scene: SceneConstructor): void {
    ScenesController.get(scene).stop()
  }

  static setState(scene: SceneConstructor, state: SceneStateConstructor, stateSetup: any): void {
    ScenesController.get(scene).startState(state, stateSetup)
  }
}
