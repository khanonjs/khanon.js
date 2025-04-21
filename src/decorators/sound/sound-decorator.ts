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
  return function <T extends { new (...args: any[]): SoundInterface }>(constructorOrTarget: (T & SoundInterface), contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    Logger.trace('aki Sound decorator')
    const className = constructorOrTarget.name
    const decorateClass = () => {
      const _classCore = class extends constructorOrTarget implements SoundInterface {
        props = props
        sounds: Map<SceneInterface | ActorInterface, BABYLON.StaticSound> = new Map()

        _load(source: SceneInterface | ActorInterface): LoadingProgress {
          if (!this.sounds.has(source)) {
            const progress = new LoadingProgress()
            const asset = AssetsController.getAsset(this.props.url)
            // this.sounds.set(source, BABYLON.CreateSoundAsync('', ''))
            // return progress
            return new LoadingProgress().complete()
          } else {
            return new LoadingProgress().complete()
          }

          /* if (this.props.url) {
            const asset = AssetsController.getAsset(this.props.url)
            if (asset && asset.definition.data) {
              const progress = new LoadingProgress()
              BABYLON.LoadAssetContainerAsync(asset.file, scene.babylon.scene)
                .then((assetContainer) => {
                  this.assetContainers.set(scene, assetContainer)
                  progress.complete()
                })
                .catch(error => progress.error(error))
              return progress
            } else {
              Logger.error(`Asset '${this.props.url}' not found on mesh loading:`, this.Instance.getClassName())
              return new LoadingProgress().complete()
            }
          } */
        }

        _unload(): void {

        }

        spawn(scene: SceneInterface): SoundInterface {
          // const sound = new _classInterface(scene, this.props)
          // return sound
          return null as any
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
    if (constructorOrTarget.prototype) { // Defined prototype means it is a decorated class
      return decorateClass()
    } else if ((
      constructorOrTarget instanceof ActorInterface ||
      constructorOrTarget instanceof ActorActionInterface ||
      constructorOrTarget instanceof ActorStateInterface ||
      constructorOrTarget instanceof SceneInterface ||
      constructorOrTarget instanceof SceneActionInterface ||
      constructorOrTarget instanceof SceneStateInterface
    ) && !descriptor) { // Undefined descriptor means it is a decorated property, otherwiese it is a decorated method
      Logger.trace('aki add sound property decorator')
      @Sound(props)
      abstract class _soundInterface extends SoundInterface {
        _className = contextOrProperty as any
      }
      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.sounds.push({
        propertyName: contextOrProperty as string,
        classDefinition: _soundInterface as any
      })
    } else {
      Logger.debugError('Cannot apply sound decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
