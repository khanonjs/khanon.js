import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorsController,
  MeshesController,
  ParticlesController,
  SceneStatesController,
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
import { CameraConstructor } from '../../camera/camera-constructor'
import { CameraInterface } from '../../camera/camera-interface'
import { SceneInterface } from '../scene-interface'
import { SceneRemove } from '../scene-remove'
import { SceneSpawn } from '../scene-spawn'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export function SceneState(props: SceneStateProps = {}): any {
  return function <T extends { new (...args: any[]): SceneStateInterface }>(constructor: T & SceneStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SceneStateInterface {
      constructor(readonly scene: SceneInterface, props: SceneStateProps) {
        super()
        this.props = props
        if (this.scene) {
          this._spawn = this.scene.spawn
          this._remove = this.scene.remove
          this.metadata.applyProps(this)
        }
      }

      props: SceneStateProps
      setup: any
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      _spawn: SceneSpawn
      _remove: SceneRemove
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      get spawn(): SceneSpawn { return this._spawn }
      get remove(): SceneRemove { return this._remove }

      switchCamera(camera: CameraConstructor, setup: any): void {
        this.scene.switchCamera(camera, setup)
      }

      getCamera<C extends CameraInterface = CameraInterface>(): C {
        return this.scene.getCamera()
      }

      start(setup: any): void {
        Logger.debug('SceneState start', _classInterface.prototype, this.scene.constructor.prototype)
        this.setup = setup
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
    const _classCore = class implements SceneStateCore {
      props = props
      Instance: SceneStateInterface = new _classInterface(null as any, null as any)

      spawn(scene: SceneInterface): SceneStateInterface {
        const state = new _classInterface(scene, this.props)
        return state
      }

      load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          ActorsController.load(this.props.actors, scene),
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance.metadata?.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance.metadata?.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance.metadata?.getProps().particles, scene)
        ])
      }

      unload(scene: SceneInterface): void {
        ActorsController.unload(this.props.actors, scene)
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance.metadata?.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance.metadata?.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance.metadata?.getProps().particles, scene)
      }
    }
    SceneStatesController.register(new _classCore())
    return _classInterface
  }
}
