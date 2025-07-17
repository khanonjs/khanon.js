import { StaticSound } from '@babylonjs/core/AudioV2/abstractAudio/staticSound'
import { StreamingSound } from '@babylonjs/core/AudioV2/abstractAudio/streamingSound'

import { Loadable } from '../../base'
import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import { SoundProps } from './sound-props'

export abstract class SoundInterface implements Loadable<void> {
  abstract _props: SoundProps
  abstract sound: StaticSound | StreamingSound
  abstract _load(): LoadingProgress
  abstract _unload(): void
  abstract getClassName(): string
}
