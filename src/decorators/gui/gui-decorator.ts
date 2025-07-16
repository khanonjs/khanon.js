
import * as BABYLONGUI from '@babylonjs/gui'

import {
  LoadingProgress,
  Metadata
} from '../../base'
import { Core } from '../../base/core/core'
import {
  GUIController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { FlexId } from '../../types/flex-id'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneInterface } from '../scene/scene-interface'
import { GUICore } from './gui-core'
import { GUIInterface } from './gui-interface'
import { GUIProps } from './gui-props'
import { GUIStateConstructor } from './gui-state/gui-state-constructor'
import { GUIStateInterface } from './gui-state/gui-state-interface'

export function GUI(props: GUIProps = {}): any {
  return function <T extends { new (...args: any[]): GUIInterface }>(constructor: T & GUIInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements GUIInterface<any> {
      constructor(readonly scene: SceneInterface, props: GUIProps) {
        super()
        this.props = props
        if (this.scene) {
          this.babylon.scene = this.scene.babylon.scene
          this._metadata.applyProps(this, this.scene)
        }
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      props: GUIProps
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      babylon: Pick<BabylonAccessor<BABYLON.TargetCamera>, 'gui' | 'scene'> = { gui: null as any, scene: null as any }
      setup: any
      _loopUpdate = true
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>
      // _state: GUIStateInterface | null = null
      particles: Map<FlexId, ParticleInterface> = new Map<FlexId, ParticleInterface>()

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }
      // get state(): GUIStateInterface | null { return this._state }

      _initialize(setup: any) {
        this.babylon.gui = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI('')
        this.setup = setup
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
        invokeCallback(this.onInitialize, this, this.babylon.gui)
      }

      _release() {
        this.clearAllTimeouts()
        invokeCallback(this.onDestroy, this)
        this.babylon.gui?.dispose()
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      // show(): void {
      //   switchLoopUpdate(this._loopUpdate, this)
      //   attachCanvasResize(this)
      //   invokeCallback(this.onShow, this)
      // }

      // hide(): void {
      //   invokeCallback(this.onHide, this)
      //   removeLoopUpdate(this)
      //   removeCanvasResize(this)
      // }

      // switchState(state: GUIStateConstructor, setup: any): GUIStateInterface {
      //   return null as any
      // }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    const _classCore = class implements GUICore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: GUIInterface = new _classInterface(null as any, null as any)
      loaded = false

      _load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().complete()
        // return new LoadingProgress().fromNodes([
        //   SpritesController.load(this.props.sprites, scene),
        //   SpritesController.load(this.Instance.metadata.getProps().sprites, scene),
        //   MeshesController.load(this.props.meshes, scene),
        //   MeshesController.load(this.Instance.metadata.getProps().meshes, scene),
        //   ParticlesController.load(this.props.particles, scene),
        //   ParticlesController.load(this.Instance.metadata.getProps().particles, scene)
        // ])
      }

      _unload(scene: SceneInterface): void {
        // SpritesController.unload(this.props.sprites, scene)
        // SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
        // MeshesController.unload(this.props.meshes, scene)
        // MeshesController.unload(this.Instance.metadata.getProps().meshes, scene)
        // ParticlesController.unload(this.props.particles, scene)
        // ParticlesController.unload(this.Instance.metadata.getProps().particles, scene)
      }

      spawn(scene: SceneInterface): GUIInterface {
        const gui = new _classInterface(scene, this.props)
        return gui
      }

      getClassName(): string {
        return className
      }
    }
    GUIController.register(_classInterface, new _classCore())
    return _classInterface
  }
}
