import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import { AppStatesController } from '../../controllers'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import { applyDefaults } from '../../utils/utils'
import { AppInterface } from './app-interface'
import { AppProps } from './app-props'
import { AppStateConstructor } from './app-state/app-state-constructor'
import { AppStateCore } from './app-state/app-state-core'
import { AppStateInterface } from './app-state/app-state-interface'
import { appPropsDefault } from './app.props.deafult'

export function App(props: AppProps): any {
  return function <T extends { new (...args: any[]): AppInterface }>(constructor: T & AppInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements AppInterface {
      props = applyDefaults(props, appPropsDefault)
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _stateCore: AppStateCore
      _state: AppStateInterface

      get state(): AppStateInterface { return this._state }

      switchState(state: AppStateConstructor, setup: any): LoadingProgress {
        const _newStateCore = AppStatesController.get(state)
        if (this._state) {
          this._state.end()
          this._stateCore.unload(_newStateCore)
        }
        if (this.props.removeTimeoutsOnStateSwitch) {
          Core.clearAllTimeouts()
        }
        const progress = _newStateCore.load()
        progress.onComplete.add(() => {
          this._stateCore = _newStateCore
          this._state = this._stateCore.spawn()
          this._state.start(setup)
        })
        return progress
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
