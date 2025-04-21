import { ControllerLoader } from '../base'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { SoundConstructor } from '../decorators/sound/sound-constructor'
import { SoundInterface } from '../decorators/sound/sound-interface'

export class SoundsController extends ControllerLoader<SoundConstructor, SoundInterface, ActorInterface>() {
  play(sound: SoundConstructor) {

  }
}
