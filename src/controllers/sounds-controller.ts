import { ControllerLoader } from '../base'
import { SoundConstructor } from '../decorators/sound/sound-constructor'
import { SoundInterface } from '../decorators/sound/sound-interface'
import { Logger } from '../modules/logger'

export class SoundsController extends ControllerLoader<SoundConstructor, SoundInterface>() {
  static play(sound: SoundConstructor): void {
    if (!SoundsController.get(sound)) { Logger.debugError(`Sound not found to be played: '${sound.name}'`); return }
    SoundsController.get(sound).sound.play()
  }

  static setVolume(value: number): void {
    // 8a8f
  }
}
