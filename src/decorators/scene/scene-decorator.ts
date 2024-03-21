import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'
import { ActorsController } from '../../controllers/actors-controller'
import { ScenesController } from '../../controllers/scenes-controller'
import { LoadingProgress } from '../../models'
import { BabylonContainer } from '../../models/babylon-container'
import { SceneCore } from './scene-core'
import { SceneInterface } from './scene-interface'
import { SceneProps } from './scene-props'

// 8a8f can those methods be added to index.d.ts decorator declaration?
// Should be they added to scene-interface in declaration file?
// Should the methods be added to the function return as a type?

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SceneCore & SceneInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore, SceneInterface {
      // Core
      props = props

      setEngineParams(): void {}
      renderStart(id: string): void {}
      renderStop(id: string): void {}

      // Interface
      babylon: Pick<BabylonContainer, 'engine' | 'scene'>
      loaded: boolean
      started: boolean

      start(state: StateConstructor): void {

      }

      stop(): void {

      }

      load(): LoadingProgress {
        ActorsController.load(this.props.actors, this)
        return {} as LoadingProgress // 8a8f
      }

      unload(): void {

      }

      setState(state: StateConstructor): void {

      }

      spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void {

      }
    }
    ScenesController.register(new _class())
    return _class
  }
}
