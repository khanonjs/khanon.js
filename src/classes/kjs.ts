/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-namespace */
import { SceneController } from '../controllers/scene-controller'

/* export class KJS {
  public Scene = new SceneController()
} */

export namespace KJS {
  export namespace Scene { // ControllerScene
    export function load(/* scene: SceneConstructor */)/*: Observable<LoadingProgress> */ {
      console.log('aki JODER')
      SceneController.load()
      // return 1
    }
    // function unload(scene: SceneConstructor): void
    // function start(scene: SceneConstructor, effect: TransitionEffect): void
    // function stop(scene: SceneConstructor, effect: TransitionEffect): void
  }
}
