import { LoadingProgress } from '../../base'
import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'
import { ActorsController } from '../../controllers/actors-controller'
import { ScenesController } from '../../controllers/scenes-controller'
import { BabylonContainer } from '../../models'
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
      _loaded: boolean
      _started: boolean

      setEngineParams(): void {}
      renderStart(id: string): void {}
      renderStop(id: string): void {}

      // Interface
      babylon: Pick<BabylonContainer, 'engine' | 'scene'>
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }

      start(state: StateConstructor): void {

      }

      stop(): void {

      }

      load(): LoadingProgress {
        // 8a8f create scene
        return ActorsController.load(this.props.actors, this)
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
