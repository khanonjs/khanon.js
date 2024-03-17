import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'
import { SceneController } from '../../controllers/scenes-controller'
import { SceneCore } from './scene-core'
import { SceneInterface } from './scene-interface'
import { SceneProps } from './scene-props'

// 8a8f can those methods be added to index.d.ts decorator declaration?
// Should be they added to scene-interface in declaration file?
// Should the methods be added to the function return as a type?

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SceneCore & SceneInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore, SceneInterface {
      babylonEngine: BabylonEngine
      renderStart: (id: string) => void
      renderStop: (id: string) => void
      babylon: BabylonScene
      loaded: boolean
      started: boolean

      // Core methods, only to be used within KhanonJs
      setEngineParams(): void {
      }

      start(state: StateConstructor): void {

      }

      stop(): void {

      }

      load(): void {
        console.log('aki DECORATOR LOAD')
      }

      unload(): void {

      }

      setState(state: StateConstructor): void {

      }

      spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void {

      }
    }
    const instance = new _class()
    SceneController.registerScene(instance)
    return _class
  }
}
