import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  AppStatesController,
  GUIController,
  ScenesController
} from '../../../controllers'
import { Rect } from '../../../models/rect'
import { Arrays } from '../../../modules/helper/arrays'
import { Logger } from '../../../modules/logger'
import { FlexId } from '../../../types/flex-id'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneConstructor } from '../../scene/scene-constructor'
import { AppStateCore } from './app-state-core'
import { AppStateInterface } from './app-state-interface'
import { AppStateProps } from './app-state-props'

export function AppState(props: AppStateProps = {}): any {
  return function <T extends { new (...args: any[]): AppStateInterface }>(constructor: T & AppStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements AppStateInterface {
      constructor(props: AppStateProps) {
        super()
        this.props = props
        this.metadata.applyProps(this)
      }

      props: AppStateProps
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _loopUpdate: boolean
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      setup: any

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return this._loopUpdate }

      start(): void {
        Logger.debug('AppState start', _classInterface.prototype)
        invokeCallback(this.onStart, this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      end(): void {
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    const _classCore = class implements AppStateCore {
      props = props
      Instance: AppStateInterface = new _classInterface(null as any)

      spawn(): AppStateInterface {
        const state = new _classInterface(this.props)
        return state
      }

      load(): LoadingProgress {
        const progress = new LoadingProgress().fromNodes([
          ScenesController.load(this.props.scenes, null),
          GUIController.load(this.props.guis, null)
        ])
        return progress
      }

      unload(_newStateCore: AppStateCore): void {
        const unloadScenes = Arrays.removeDuplicatesInBoth(this.props.scenes ?? [], _newStateCore.props.scenes ?? [])
        const unloadGuis = Arrays.removeDuplicatesInBoth(this.props.guis ?? [], _newStateCore.props.guis ?? [])
        ScenesController.stop(unloadScenes)
        ScenesController.unload(unloadScenes, null)
        GUIController.unload(unloadGuis, null)
      }
    }
    AppStatesController.register(new _classCore())
    return _classInterface
  }
}
