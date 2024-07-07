import { ScenesController } from './controllers'
import { Core } from './core'

export class KJS {
  static throw(error?: any): void {
    Core.throw(error)
  }

  static clearCache(): void {
    // TODO
  }

  static get Scene(): ScenesController { return ScenesController }
}

export default KJS
