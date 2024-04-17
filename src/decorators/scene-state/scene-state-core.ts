import { SceneStateProps } from './scene-state-props'

export abstract class SceneStateCore {
  abstract props: SceneStateProps
  abstract start(): void
  abstract end(): void
}
