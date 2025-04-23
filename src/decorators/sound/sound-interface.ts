import * as BABYLON from '@babylonjs/core'

import { Loadable } from '../../base'
import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import { SoundProps } from './sound-props'

export abstract class SoundInterface implements Loadable<void> {
  abstract props: SoundProps
  abstract sound: BABYLON.StaticSound | BABYLON.StreamingSound
  abstract _load(): LoadingProgress
  abstract _unload(): void
  abstract getClassName(): string
}
