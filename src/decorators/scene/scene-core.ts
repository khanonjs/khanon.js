import { CameraConstructor } from '../../constructors/camera-constructor'
import { AssetDefinition } from '../../models/asset-definition'
import { SceneProps } from './scene-props'
import { SceneSpawn } from './scene-spawn'

export abstract class SceneCore {
  abstract props: SceneProps
  protected abstract _assets: AssetDefinition[]
  protected abstract _loaded: boolean
  protected abstract _started: boolean
  protected abstract _spawn: SceneSpawn
  abstract get assets(): AssetDefinition[]
  abstract setCamera(camera: CameraConstructor): void
  abstract setEngineParams(): void
  abstract renderStart(id: string): void
  abstract renderStop(id: string): void
}
