import {
  LoadingProgress,
  Spawnable
} from '../../base'
import { Loadable } from '../../base/interfaces/loadable'
import { SceneInterface } from '../scene/scene-interface'
import { ParticleInterface } from './particle-interface'
import { ParticleProps } from './particle-props'
import { ParticlePropsDefault } from './particle.props.deafult'

export abstract class ParticleCore implements Loadable<SceneInterface>, Spawnable<ParticleInterface> {
  props: ParticleProps & ParticlePropsDefault
  abstract Instance: ParticleInterface
  abstract spawn(container?: any): ParticleInterface
  abstract load(owner?: SceneInterface): LoadingProgress
  abstract unload(owner?: SceneInterface): void
}
