import { Engine as BabylonJsEngine } from '@babylonjs/core/Engines/engine'

import { StateMachine } from '../../modules/state-machine/state-machine'

export class SceneCore {
  protected babylonJsEngine: BabylonJsEngine
  private renderStart: (id: string) => void
  private renderStop: (id: string) => void

  protected state: StateMachine

  // Core methods, only to be used within KhanonJs
  setEngineParams(): void {

  }
}