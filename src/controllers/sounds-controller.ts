import { ControllerLoader } from '../base'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SoundConstructor } from '../decorators/sound/sound-constructor'
import { SoundCore } from '../decorators/sound/sound-core'

export class SoundsController extends ControllerLoader<SoundConstructor, SoundCore, ActorInterface>(true) {
  play(sound: SoundConstructor) {

  }
}
