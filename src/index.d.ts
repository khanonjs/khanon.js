import { Observable } from '@babylonjs/core'

export * from './models'
export * from './modules'

export { Core } from './core'

// ****** NEW DECORATOR BASED ENGINE ***********

declare enum ETransitionEffect {
  FADE
}

interface LoadingProgress {
  progress: number // 0 to 1
  completed: boolean
}

interface TransitionEffect {
  effect: ETransitionEffect
  factor: number
}

declare class State<T> {
  target: T // Can be a Scene or an Actor
}
declare type StateConstructor = new () => State<any>

declare class Particle {
}
declare type ParticleConstructor = new () => Particle

declare class ParticleSource {
}
declare type ParticleSourceConstructor = new () => ParticleSource

declare class ActorsController {
}

declare class Actor {
  controller: ActorsController
}
declare type ActorConstructor = new () => Actor

declare class Scene {
  // Decorator properties
  decorator_states: StateConstructor[]
  decorator_actors: ActorConstructor[]
  decorator_assets: any

  // Properties
  camera: void
  actors: ActorsController

  // Methods
  setState(state: StateConstructor): void
  spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void

  // Callbacks
  onLoad(): void
  onUnload(): void
  onStart(): void
  onStop(): void
}
declare type SceneConstructor = new () => Scene

declare class GUI {
  // Decorator properties
  decorator_assets: any
}
declare type GUIConstructor = new () => GUI

export declare namespace KJS {
  namespace Scene { // ControllerScene
    function load(/* scene: SceneConstructor */): Observable<LoadingProgress>
    function unload(scene: SceneConstructor): void
    function start(scene: SceneConstructor, effect: TransitionEffect): void
    function stop(scene: SceneConstructor, effect: TransitionEffect): void
  }

  namespace GUI { // ControllerGUI
    function load(gui: GUIConstructor): Observable<LoadingProgress>
    function unload(gui: GUIConstructor): void
    function show(gui: GUIConstructor): void
    function hide(gui: GUIConstructor): void
  }
}
