import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine'

import { SceneProps } from './scene-props'

export abstract class SceneCore {
  props: SceneProps
  babylonEngine: BabylonEngine

  abstract renderStart: (id: string) => void
  abstract renderStop: (id: string) => void
  abstract setEngineParams(): void
}
