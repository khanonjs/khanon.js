import { Core } from './classes/core'
import { SceneController } from './controllers/scene-controller'

/* export class KJS {
  public Scene = new SceneController()
} */

export class KJS {
  static throw(error?: any): void {
    Core.throw(error)
  }

  static get Scene(): SceneController {
    return SceneController
  }

  /*
  export namespace Scene { // ControllerScene
    export function load( scene: SceneConstructor ): Observable<LoadingProgress>  {
      ScenesController.load()
      // return 1
    }
    // function unload(scene: SceneConstructor): void
    // function start(scene: SceneConstructor, effect: TransitionEffect): void
    // function stop(scene: SceneConstructor, effect: TransitionEffect): void
  }*/
}

export default KJS
