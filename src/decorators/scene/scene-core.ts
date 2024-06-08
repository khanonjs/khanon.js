import { CameraConstructor } from '../../constructors'
import { AssetDefinition } from '../../models'
import { SceneProps } from './scene-props'

export abstract class SceneCore {
  abstract props: SceneProps
  protected abstract _assets: AssetDefinition[]
  protected abstract _loaded: boolean
  protected abstract _started: boolean
  abstract get assets(): AssetDefinition[]
  abstract setCamera(camera: CameraConstructor): void
  abstract setEngineParams(): void
  abstract renderStart(id: string): void
  abstract renderStop(id: string): void
}
