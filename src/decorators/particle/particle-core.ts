import {
  LoadingProgress,
  Spawnable
} from '../../base'
import { Loadable } from '../../base/interfaces/loadable'
import { SceneInterface } from '../scene/scene-interface'
import { ParticleAttachmentInfo } from './particle-attachment-info'
import { ParticleInterface } from './particle-interface'
import { ParticleProps } from './particle-props'
import { ParticlePropsDefault } from './particle.props.deafult'

export abstract class ParticleCore implements Loadable<SceneInterface>, Spawnable<ParticleInterface> {
  props: ParticleProps & ParticlePropsDefault
  abstract Instance: ParticleInterface
  abstract spawn(scene: SceneInterface, attachmentInfo?: ParticleAttachmentInfo, dontCreate?: boolean, setup?: any): ParticleInterface
  abstract _load(owner?: SceneInterface): LoadingProgress
  abstract _unload(owner?: SceneInterface): void
  abstract getClassName(): string
}
