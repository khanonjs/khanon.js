import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine'

export abstract class SceneCore {
  babylonEngine: BabylonEngine

  abstract renderStart: (id: string) => void
  abstract renderStop: (id: string) => void
  abstract setEngineParams(): void
}
