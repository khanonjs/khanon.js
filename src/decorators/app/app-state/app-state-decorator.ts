import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { AppStatesController } from '../../../controllers'
import { Rect } from '../../../models/rect'
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
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      setup: any

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

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
        // 8a8f should load new state before ending prev state (add Scenes and GUIS here)
        const progress = new LoadingProgress().complete()
        return progress
      }

      unload(): void {
      }
    }
    AppStatesController.register(new _classCore())
    return _classInterface
  }
}
