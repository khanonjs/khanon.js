import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorsController,
  GUIStatesController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../../controllers'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
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
import { SceneInterface } from '../../scene/scene-interface'
import { GUIInterface } from '../gui-interface'
import { GUIStateCore } from './gui-state-core'
import { GUIStateInterface } from './gui-state-interface'
import { GUIStateProps } from './gui-state-props'

export function GUIState(props: GUIStateProps = {}): any {
  return function <T extends { new (...args: any[]): GUIStateInterface }>(constructor: T & GUIStateInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements GUIStateInterface {
      constructor(readonly gui: GUIInterface, props: GUIStateProps) {
        super()
        this._props = props
        if (this.gui) {
          this._metadata.applyProps(this, this.gui.scene)
        }
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _props: GUIStateProps
      setup: any
      _loopUpdate = true
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      _start(setup: any): void {
        Logger.debug('GUIState start', this.getClassName(), this.gui.getClassName())
        this.setup = setup
        invokeCallback(this.onStart, this)
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
      }

      _end(): void {
        this.clearAllTimeouts()
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    const _classCore = class implements GUIStateCore {
      props = props
      Instance: GUIStateInterface = new _classInterface(null as any, null as any)

      spawn(gui: GUIInterface): GUIStateInterface {
        const state = new _classInterface(gui, this.props)
        return state
      }

      _load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance._metadata?.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance._metadata?.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance._metadata?.getProps().particles, scene)
        ])
      }

      _unload(scene: SceneInterface): void {
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance._metadata?.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance._metadata?.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance._metadata?.getProps().particles, scene)
      }

      getClassName(): string {
        return className
      }
    }
    GUIStatesController.register(new _classCore())
    return _classInterface
  }
}
