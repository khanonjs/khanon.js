import { ScenesController } from './controllers/scenes-controller'
import { Core } from './core'

export class KJS {
  static throw(error?: any): void {
    Core.throw(error)
  }

  static clearCache(): void {
    // TODO 8a8f
  }

  static get Scene(): ScenesController { return ScenesController }
}

export default KJS
