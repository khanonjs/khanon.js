import { ScenesController } from '../controllers/scenes-controller'

/* export class KJS {
  public Scene = new SceneController()
} */

export namespace KJS {
  export namespace Scene { // ControllerScene
    export function load(/* scene: SceneConstructor */)/*: Observable<LoadingProgress> */ {
      ScenesController.load()
      // return 1
    }
    // function unload(scene: SceneConstructor): void
    // function start(scene: SceneConstructor, effect: TransitionEffect): void
    // function stop(scene: SceneConstructor, effect: TransitionEffect): void
  }
}
