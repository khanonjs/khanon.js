import { Observer } from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { DisplayObject } from '../../base/classes/display-object'
import {
  MeshConstructor,
  SpriteConstructor
} from '../../constructors'
import {
  ActorsController,
  SpritesController
} from '../../controllers'
import { MeshesController } from '../../controllers/meshes-controller'
import { Rect } from '../../models'
import { Logger } from '../../modules'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import {
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate
} from '../../utils/utils'
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorComposition } from './actor-composition'
import { ActorCore } from './actor-core'
import { ActorInterface } from './actor-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'

export function Actor(props: ActorProps): any {
  return function <T extends { new (...args: any[]): ActorInterface }>(constructor: T & ActorInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorInterface {
      metadata: ActorMetadata // = Reflect.getMetadata('metadata', this)  // 8a8f
      body: SpriteInterface | MeshInterface
      transform: SpriteTransform | MeshTransform
      composition: ActorComposition
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>

      constructor(readonly scene: SceneType) {
        super()
        this.composition = new ActorComposition(this)
      }

      onSpawn?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

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
        // SpritesController.load(this.props.sprites, scene)
        // 8a8f Load  the rest of props
        return progress
      }

      unload(): void {

      }

      spawn(scene: SceneType): ActorInterface {
        const actor = new _classInterface(scene)
        invokeCallback(actor.onSpawn, actor, scene)
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
