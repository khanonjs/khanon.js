import { Scene as BabylonScene } from '@babylonjs/core/scene'

import { LoadingProgress } from '../../base'
import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'
import { ActorsController } from '../../controllers/actors-controller'
import { AssetsController } from '../../controllers/assets-controller'
import { ScenesController } from '../../controllers/scenes-controller'
import { Core } from '../../core'
import { removeDuplicities } from '../../helpers/utils'
import {
  AssetDefinition,
  BabylonContainer
} from '../../models'
import { SceneCore } from './scene-core'
import { SceneInterface } from './scene-interface'
import { SceneProps } from './scene-props'
import { SceneType } from './scene-type'

// 8a8f can those methods be added to index.d.ts decorator declaration?
// Should be they added to scene-interface in declaration file?
// Should the methods be added to the function return as a type?

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): SceneType }>(constructor: T & SceneType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore, SceneInterface {
      // Core
      props = removeDuplicities(props)
      _loaded: boolean
      _started: boolean

      setEngineParams(): void {}
      renderStart(id: string): void {}
      renderStop(id: string): void {}

      // Interface
      babylon: Pick<BabylonContainer, 'scene'> = { scene: null }
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }

      start(state: StateConstructor): void {

      }

      stop(): void {

      }

      load(): LoadingProgress {
        // Create babylon scene and apply configuration
        this.babylon.scene = new BabylonScene(Core.engine, this.props.options)
        if (this.props.configuration) {
          for (const [key, value] of Object.entries(this.props.configuration)) {
            this.babylon.scene[key] = value
          }
        }

        // Babylon inspector (only DEV mode). Babylon inspector's imports are removed on webpack build.
        if (Core.isDevelopmentMode()) {
          this.debugInspector()
        }

        const progress = AssetsController.sceneLoad(this)

        return progress// ActorsController.load(this.props.actors, this)
      }

      unload(): void {

      }

      setState(state: StateConstructor): void {

      }

      spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void {

      }

      debugInspector(): void {
        window.addEventListener('keydown', (ev) => {
          if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
            // 8a8f
            /*
            // @ts-ignore
            if (this.babylonjs.debugLayer.isVisible()) {
              // @ts-ignore
              this.babylonjs.debugLayer.hide()
            } else {
              // @ts-ignore
              this.babylonjs.debugLayer.show()
            } */
          }
        })
      }
    }
    ScenesController.register(new _class())
    return _class
  }
}
