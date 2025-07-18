import {
  CreateSoundAsync,
  CreateStreamingSoundAsync
} from '@babylonjs/core/AudioV2/abstractAudio/audioEngineV2'
import { StaticSound } from '@babylonjs/core/AudioV2/abstractAudio/staticSound'
import { StreamingSound } from '@babylonjs/core/AudioV2/abstractAudio/streamingSound'

import { Metadata } from '../../base'
import { Core } from '../../base/core/core'
import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import {
  AssetsController,
  SoundsController
} from '../../controllers'
import { Logger } from '../../modules/logger'
import { ActorActionInterface } from '../actor/actor-action/actor-action-interface'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { SceneActionInterface } from '../scene/scene-action/scene-action-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneStateInterface } from '../scene/scene-state/scene-state-interface'
import { SoundInterface } from './sound-interface'
import { SoundProps } from './sound-props'

export function Sound(props: SoundProps): any {
  return function <T extends { new (...args: any[]): SoundInterface }>(target: (T & SoundInterface), contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const className = target.name
    const decorateClass = () => {
      const _classInterface = class extends target implements SoundInterface {
        _props = props
        sound: StaticSound | StreamingSound

        _load(): LoadingProgress {
          const progress = new LoadingProgress()
          if (this._props.stream) {
            CreateStreamingSoundAsync(this.getClassName(), this._props.url, { spatialEnabled: !!this._props.spatialEnabled })
              .then((sound) => {
                this.sound = sound
                progress.complete()
              })
              .catch((error) => {
                progress.error(error)
              })
          } else {
            const asset = AssetsController.getAsset(this._props.url)
            if (asset) {
              CreateSoundAsync(this.getClassName(), asset.audioBuffer, { spatialEnabled: !!this._props.spatialEnabled })
                .then((sound) => {
                  this.sound = sound
                  progress.complete()
                })
                .catch((error) => {
                  progress.error(error)
                })
            }
          }
          return progress
        }

        _unload(): void {
          this.sound.dispose()
          this.sound = null as any
        }

        getClassName(): string {
          return className
        }
      }
      Core.needAudioEngine = true
      SoundsController.register(_classInterface, new _classInterface())
      return _classInterface
    }

    // Mutates decorator to class or property
    if (target.prototype) { // Defined prototype means it is a decorated class
      return decorateClass()
    } else if ((
      target instanceof ActorInterface ||
      target instanceof ActorActionInterface ||
      target instanceof ActorStateInterface ||
      target instanceof SceneInterface ||
      target instanceof SceneActionInterface ||
      target instanceof SceneStateInterface
    ) && !descriptor) { // Undefined descriptor means it is a decorated property, otherwiese it is a decorated method
      @Sound(props)
      abstract class _soundInterface extends SoundInterface {
        _className = contextOrProperty as any
      }
      if (!Reflect.hasMetadata('metadata', target)) {
        Reflect.defineMetadata('metadata', new Metadata(), target)
      }
      const metadata = Reflect.getMetadata('metadata', target) as Metadata
      if ((target instanceof SceneInterface ||
        target instanceof SceneActionInterface ||
        target instanceof SceneStateInterface) && props.spatialEnabled) {
        Logger.warn('Defining spatial sound to a scene is not allowed. Spatial sounds can only be defined on actors.', target.constructor.name)
      }
      metadata.sounds.push({
        propertyName: contextOrProperty as string,
        classDefinition: _soundInterface as any
      })
    } else {
      Logger.error('Cannot apply sound decorator to non allowed property class:', target, contextOrProperty)
    }
  }
}
