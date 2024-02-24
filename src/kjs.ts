import { Core } from './classes/core'
import { SceneController } from './controllers/scene-controller'

export class KJS {
  static _throw(error?: any): void {
    Core.throw(error)
  }

  static get Scene(): SceneController {
    return SceneController
  }
}

export default KJS
