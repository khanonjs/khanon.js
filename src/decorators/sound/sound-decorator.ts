// 8a8f
// https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic
// https://doc.babylonjs.com/typedoc/interfaces/BABYLON.IWebAudioEngineOptions#audiocontext
// https://doc.babylonjs.com/typedoc/interfaces/BABYLON.IAbstractSoundOptions#maxinstances

// Los sonidos están explicitamente asociados a un contexto (escena o actor).
// No se permite crear más de un sonido con la misma URL por contexto.
// Por defecto se crea un solo sonido para todas las instancias de actor.

// https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic#spatial-audio
// Para audios creados dentro de contextos como Actor, indicar spatialEnabled significa que se creará un CreateSoundAsync por cada instancia de actor y se asociará al body del actor.
// por tanto este afecta al setBody. Si spatialEnabled es false, se crea un único sonido para todas las instancias del actor.
// Spatial actor no puede ir junto a audio stream

// https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic#sound-buffers
// AssetsController crea un sonido y provee el buffer cuando sea necesario crear la instancia del sonido.

// https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic#using-browser-specific-audio-codecs
// La URL del sonido permite string o array de strings. Si es un array, se intentará cargar cada uno de los sonidos hasta que uno funcione.

// https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic#browser-autoplay-considerations
// Testear esto

import * as BABYLON from '@babylonjs/core'

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
      const _classCore = class extends target implements SoundInterface {
        props = props
        sound: BABYLON.StaticSound

        _load(): LoadingProgress {
          Logger.trace('aki load sound', this.props.url)
          const progress = new LoadingProgress()
          const asset = AssetsController.getAsset(this.props.url)
          if (asset) {
            BABYLON.CreateSoundAsync(this.props.url, asset.buffer, { spatialEnabled: !!this.props.spatialEnabled })
              .then((sound) => {
                Logger.trace('aki sound loaded!!', this.props.url)
                this.sound = sound
                progress.complete()
              })
              .catch((error) => {
                progress.error(error)
              })
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
      SoundsController.register(_classCore, new _classCore())
      return _classCore
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
      if (metadata.notifiers.get(props.url)) { Logger.debugError(`Trying to define duplicated sound '${props.url}' to element '${target.constructor.name}'.`); return }
      metadata.sounds.push({
        propertyName: contextOrProperty as string,
        classDefinition: _soundInterface as any
      })
    } else {
      Logger.debugError('Cannot apply sound decorator to non allowed property class:', target, contextOrProperty)
    }
  }
}
