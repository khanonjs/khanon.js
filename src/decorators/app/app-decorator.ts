import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import {
  AppStatesController,
  AssetsController
} from '../../controllers'
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
    const className = constructor.name
    const _class = class extends constructor implements AppInterface {
      _props = applyDefaults(props, appPropsDefault)
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _stateCore: AppStateCore
      _state: AppStateInterface | null = null

      get state(): AppStateInterface | null { return this._state }

      getClassName(): string {
        return className
      }

      switchState(state: AppStateConstructor, setup: any): LoadingProgress {
        const newStateCore = AppStatesController.get(state)
        if (this._state) {
          this._state._end()
          this._stateCore._unload(newStateCore)
        }
        AssetsController.purgeAssets(newStateCore.props.scenes)
        this._stateCore = newStateCore
        this._state = this._stateCore.spawn()
        const progress = this._stateCore._load()
        progress.onComplete.add(() => {
          this._state?._start(setup)
        })
        return progress
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    Core.initialize(new _class())
    return _class
  }
}
