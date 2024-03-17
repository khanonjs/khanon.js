import { Scene as BabylonScene } from '@babylonjs/core/scene'

import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'
import { LoadingProgress } from '../../models'

export abstract class SceneInterface {
  babylonScene: BabylonScene
  loaded: boolean
  started: boolean
  abstract start(state: StateConstructor): void
  abstract stop(): void
  abstract load(): void
  abstract unload(): void
  abstract setState(state: StateConstructor): void
  abstract spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void
  onStart?(): void
  onStop?(): void
  onLoad?(progress: LoadingProgress): void
  onUnload?(): void
  onError?(errorMsg: string): void
}
