import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorsController,
  GUIStatesController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../../controllers'
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
import { SceneInterface } from '../../scene/scene-interface'
import { GUIInterface } from '../gui-interface'
import { GUIStateCore } from './gui-state-core'
import { GUIStateInterface } from './gui-state-interface'
import { GUIStateProps } from './gui-state-props'

export function GUIState(props: GUIStateProps = {}): any {
  return function <T extends { new (...args: any[]): GUIStateInterface }>(constructor: T & GUIStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements GUIStateInterface {
      constructor(readonly gui: GUIInterface, props: GUIStateProps) {
        super()
        this.props = props
        if (this.gui) {
          this.metadata.applyProps(this)
        }
      }

      getClassName(): string {
        return constructor.name
      }

      props: GUIStateProps
      setup: any
      _loopUpdate = true
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      start(setup: any): void {
        Logger.debug('GUIState start', this.getClassName(), this.gui.getClassName())
        this.setup = setup
        invokeCallback(this.onStart, this)
        switchLoopUpdate(this._loopUpdate, this)
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
    const _classCore = class implements GUIStateCore {
      props = props
      Instance: GUIStateInterface = new _classInterface(null as any, null as any)

      spawn(gui: GUIInterface): GUIStateInterface {
        const state = new _classInterface(gui, this.props)
        return state
      }

      load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance.metadata?.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance.metadata?.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance.metadata?.getProps().particles, scene)
        ])
      }

      unload(scene: SceneInterface): void {
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance.metadata?.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance.metadata?.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance.metadata?.getProps().particles, scene)
      }
    }
    GUIStatesController.register(new _classCore())
    return _classInterface
  }
}
