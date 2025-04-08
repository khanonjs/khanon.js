import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  AppStatesController,
  GUIController,
  ScenesController
} from '../../../controllers'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
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
import { GUIInterface } from '../../gui/gui-interface'
import { AppStateCore } from './app-state-core'
import { AppStateInterface } from './app-state-interface'
import { AppStateProps } from './app-state-props'

export function AppState(props: AppStateProps = {}): any {
  return function <T extends { new (...args: any[]): AppStateInterface }>(constructor: T & AppStateInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements AppStateInterface {
      constructor(props: AppStateProps) {
        super()
        this._props = props
        this._metadata.applyProps(this)
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _props: AppStateProps
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _loopUpdate = true
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>
      setup: any
      guis: Set<GUIInterface> = new Set<GUIInterface>()

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      _start(): void {
        Logger.debug('AppState start', this.getClassName())
        // this.guisStart()
        invokeCallback(this.onStart, this)
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
      }

      _end(): void {
        // this.guisRelease()
        this.clearAllTimeouts()
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }

      // guisStart(): void {
      //   this.props.guis?.forEach(_gui => {
      //     const gui = GUIController.get(_gui).spawn()
      //     gui.initialize()
      //     this.guis.add(gui)
      //   })
      // }

      // guisRelease(): void {
      //   this.guis.forEach(gui => gui.release())
      //   this.guis.clear()
      // }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
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

      _load(): LoadingProgress {
        const progress = new LoadingProgress().fromNodes([
          ScenesController.load(this.props.scenes, null)
          // GUIController.load(this.props.guis, null)
        ])
        return progress
      }

      _unload(_newStateCore: AppStateCore): void {
        const unloadScenes = Arrays.removeDuplicatesInBoth(this.props.scenes ?? [], _newStateCore.props.scenes ?? [])
        ScenesController.stop(unloadScenes)
        ScenesController.unload(unloadScenes, null)
        // const unloadGuis = Arrays.removeDuplicatesInBoth(this.props.guis ?? [], _newStateCore.props.guis ?? [])
        // GUIController.unload(unloadGuis, null)
      }
    }
    AppStatesController.register(new _classCore())
    return _classInterface
  }
}
