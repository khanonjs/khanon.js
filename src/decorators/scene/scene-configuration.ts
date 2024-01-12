import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

export abstract class SceneConfiguration {
  abstract apply(babylonJsScene: BabylonJsScene): void
}
