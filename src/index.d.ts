import { Observable } from '@babylonjs/core'

import { GUIConstructor } from './decorators/gui/gui-constructor'
import { SceneConstructor } from './decorators/scene/scene-constructor'
import { LoadingProgress } from './models/loading-progress'

export * from './models'
export * from './modules'

export { Core } from './core'

// ****** NEW DECORATOR BASED ENGINE ***********

declare enum ETransitionEffect {
  FADE
}

interface TransitionEffect {
  effect: ETransitionEffect
  factor: number
}

export declare namespace KJS {
  namespace Scene { // ControllerScene
    function load(scene: SceneConstructor): Observable<LoadingProgress>
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
