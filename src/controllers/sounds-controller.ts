import { ControllerLoader } from '../base'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { SoundConstructor } from '../decorators/sound/sound-constructor'
import { SoundCore } from '../decorators/sound/sound-core'

export class SoundsController extends ControllerLoader<SoundConstructor, SoundCore, ActorInterface>() {
  play(sound: SoundConstructor) {

  }
}
