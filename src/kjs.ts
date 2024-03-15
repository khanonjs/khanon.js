import { SceneController } from './controllers/scenes-controller'
import { Core } from './core'

export class KJS {
  static throw_(error?: any): void {
    Core.throw(error)
  }

  static clearCache(): void {
    // TODO 8a8f
  }

  static get Scene(): SceneController { return SceneController }
}

export default KJS
