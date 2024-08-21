import {
  LoadingProgress,
  Spawnable
} from '../../base'
import { Loadable } from '../../base/interfaces/loadable'
import { SceneInterface } from '../scene/scene-interface'
import { ParticleInterface } from './particle-interface'
import { ParticleProps } from './particle-props'

export abstract class ParticleCore implements Loadable<SceneInterface>, Spawnable<ParticleInterface> {
  props: ParticleProps
  abstract Instance: ParticleInterface
  abstract spawn(container?: any): void
  abstract load(owner?: SceneInterface): LoadingProgress
  abstract unload(owner?: SceneInterface): void
}
