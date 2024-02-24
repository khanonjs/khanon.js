import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine'

export class SceneCore {
  protected babylonEngine: BabylonEngine
  private renderStart: (id: string) => void
  private renderStop: (id: string) => void

  // protected state: StateMachine

  // Core methods, only to be used within KhanonJs
  setEngineParams(): void {

  }
}