import { SceneProps } from './scene-props'

export abstract class SceneCore {
  props: SceneProps
  abstract setEngineParams(): void
  abstract renderStart(id: string): void
  abstract renderStop(id: string): void
}
