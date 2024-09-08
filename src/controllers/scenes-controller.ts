import { ControllerLoader } from '../base'
import { SceneConstructor } from '../decorators/scene/scene-constructor'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SceneStateConstructor } from '../decorators/scene/scene-state/scene-state-constructor'
import { Logger } from '../modules/logger'

export class ScenesController extends ControllerLoader<SceneInterface, SceneInterface>() {
  static start(scene: SceneConstructor, state: SceneStateConstructor, stateSetup: any): void {
    const sceneInterface = ScenesController.get(scene)
    sceneInterface.start(state, stateSetup)
  }

  static stop(scene: SceneConstructor): void {
    ScenesController.get(scene).stop()
  }

  static switchState(scene: SceneConstructor, state: SceneStateConstructor, stateSetup: any): void {
    ScenesController.get(scene).switchState(state, stateSetup)
  }
}
