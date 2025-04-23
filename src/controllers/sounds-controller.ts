import { ControllerLoader } from '../base'
import { Core } from '../base/core/core'
import { SoundConstructor } from '../decorators/sound/sound-constructor'
import { SoundInterface } from '../decorators/sound/sound-interface'
import { Logger } from '../modules/logger'

export class SoundsController extends ControllerLoader<SoundConstructor, SoundInterface>() {
  static play(sound: SoundConstructor, volume?: number): void {
    if (!SoundsController.get(sound)) { Logger.debugError(`Sound not found to be played: '${sound.name}'`); return }
    const soundCore = SoundsController.get(sound)
    if (volume) {
      soundCore.sound.volume = volume
    }
    soundCore.sound.play()
  }

  static stop(sound: SoundConstructor): void {
    if (!SoundsController.get(sound)) { Logger.debugError(`Sound not found to be stopped: '${sound.name}'`); return }
    SoundsController.get(sound).sound.stop()
  }

  static setVolume(value: number): void {
    if (Core.audioEngine) {
      Core.audioEngine.volume = value
    }
  }
}
