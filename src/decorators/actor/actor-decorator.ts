import { Observer } from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import {
  ActorsController,
  SpritesController
} from '../../controllers'
import { Rect } from '../../models'
import { Logger } from '../../modules/logger'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import {
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorComposer } from './actor-composer'
import { ActorCore } from './actor-core'
import { ActorInterface } from './actor-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'

export function Actor(props: ActorProps): any {
  return function <T extends { new (...args: any[]): ActorInterface }>(constructor: T & ActorInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorInterface {
      constructor(readonly scene: SceneType) {
        super()
      }

      initialize() {
        this.composer = new ActorComposer(this)
        invokeCallback(this.onSpawn, this, this.scene)
      }

      metadata: ActorMetadata // = Reflect.getMetadata('metadata', this)  // 8a8f
      body: SpriteInterface | MeshInterface
      transform: SpriteTransform | MeshTransform
      composer: ActorComposer
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>

      onSpawn?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      release() {
        removeLoopUpdate(this) // 8a8f esto aquí?
        removeCanvasResize(this)
      }
    }
    const _classCore = class implements ActorCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: ActorInterface = new _classInterface(null)
      loaded = false

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        SpritesController.load(this.props.sprites, scene)
        // 8a8f Load  the rest of props
        return progress
      }

      unload(): void {

      }

      spawn(scene: SceneType): ActorInterface {
        const actor = new _classInterface(scene)
        actor.initialize()
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
