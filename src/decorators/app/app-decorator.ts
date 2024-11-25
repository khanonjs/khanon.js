import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { AppStatesController } from '../../controllers'
import { FlexId } from '../../types/flex-id'
import { applyDefaults } from '../../utils/utils'
import { AppInterface } from './app-interface'
import { AppProps } from './app-props'
import { AppStateConstructor } from './app-state/app-state-constructor'
import { AppStateInterface } from './app-state/app-state-interface'
import { appPropsDefault } from './app.props.deafult'

export function App(props: AppProps): any {
  return function <T extends { new (...args: any[]): AppInterface }>(constructor: T & AppInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements AppInterface {
      props = applyDefaults(props, appPropsDefault)
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _state: AppStateInterface

      get state(): AppStateInterface { return this._state }

      // 8a8f should load new state before ending prev state
      switchState(state: AppStateConstructor, setup: any): AppStateInterface {
        const _state = AppStatesController.get(state).spawn()
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start(setup)
        return this._state
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    Core.initialize(new _class())
    return _class
  }
}
