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
        sound: BABYLON.StaticSound | BABYLON.StreamingSound

        _load(): LoadingProgress {
          const progress = new LoadingProgress()
          if (this.props.stream) {
            BABYLON.CreateStreamingSoundAsync(this.getClassName(), this.props.url, { spatialEnabled: !!this.props.spatialEnabled })
              .then((sound) => {
                this.sound = sound
                progress.complete()
              })
              .catch((error) => {
                progress.error(error)
              })
          } else {
            const asset = AssetsController.getAsset(this.props.url)
            if (asset) {
              BABYLON.CreateSoundAsync(this.getClassName(), asset.audioBuffer, { spatialEnabled: !!this.props.spatialEnabled })
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
      if ((target instanceof SceneInterface ||
        target instanceof SceneActionInterface ||
        target instanceof SceneStateInterface) && props.spatialEnabled) {
        Logger.warn('Defining spatial sound to a scene element is not allowed.', target.constructor.name)
      }
      metadata.sounds.push({
        propertyName: contextOrProperty as string,
        classDefinition: _soundInterface as any
      })
    } else {
      Logger.debugError('Cannot apply sound decorator to non allowed property class:', target, contextOrProperty)
    }
  }
}
