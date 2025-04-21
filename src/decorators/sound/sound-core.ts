import {
  Loadable,
  LoadingProgress
} from '../../base'
import { ActorInterface } from '../actor/actor-interface'
import { SoundInterface } from './sound-interface'
import { SoundProps } from './sound-props'

export abstract class SoundCore implements Loadable<ActorInterface> {
  abstract props: SoundProps
  abstract Instance: SoundInterface
  abstract _load(actor: ActorInterface): LoadingProgress
  abstract _unload(): void
  abstract getClassName(): string
}
